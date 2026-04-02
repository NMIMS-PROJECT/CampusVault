import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        [key: string]: any;
      };
    }
  }
}

router.post('/', verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, company, text, isPaid, cost } = req.body;
    const authorId = (req as any).user?.uid;

    if (!authorId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!title || !company || !text) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (isPaid && (!cost || cost <= 0)) {
      res.status(400).json({ error: 'Cost must be provided and greater than 0 for paid questions' });
      return;
    }

    const student = await prisma.student.findUnique({
      where: { id: authorId },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const question = await prisma.question.create({
      data: {
        title,
        company,
        text,
        isPaid: isPaid || false,
        cost: isPaid ? cost : null,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { company, isPaid } = req.query;
    const filters: any = {};

    if (company) {
      filters.company = {
        contains: company as string,
        mode: 'insensitive',
      };
    }

    if (isPaid !== undefined) {
      filters.isPaid = isPaid === 'true';
    }

    const questions = await prisma.question.findMany({
      where: filters,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        purchases: {
          select: {
            buyerId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        purchases: {
          select: {
            buyerId: true,
          },
        },
      },
    });

    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

router.post('/:id/purchase', verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const buyerId = (req as any).user?.uid;
  const { id: questionId } = req.params;

  if (!buyerId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const result = await prisma.\(async (tx: any) => {
      const question = await tx.question.findUnique({
        where: { id: questionId },
        include: {
          author: true,
        },
      });

      if (!question) {
        throw new Error('Question not found');
      }

      if (!question.isPaid || !question.cost) {
        throw new Error('This question is not for sale');
      }

      const existingPurchase = await tx.questionPurchase.findUnique({
        where: {
          questionId_buyerId: {
            questionId,
            buyerId,
          },
        },
      });

      if (existingPurchase) {
        throw new Error('You have already purchased this answer');
      }

      const buyer = await tx.student.findUnique({
        where: { id: buyerId },
      });

      if (!buyer) {
        throw new Error('Buyer not found');
      }

      if (buyer.creditBalance < question.cost) {
        throw new Error('Insufficient credits');
      }

      const updatedBuyer = await tx.student.update({
        where: { id: buyerId },
        data: {
          creditBalance: {
            decrement: question.cost,
          },
        },
      });

      const updatedAuthor = await tx.student.update({
        where: { id: question.authorId },
        data: {
          creditBalance: {
            increment: question.cost,
          },
        },
      });

      const purchase = await tx.questionPurchase.create({
        data: {
          questionId,
          buyerId,
          amount: question.cost,
          status: 'completed',
        },
      });

      return {
        purchase,
        answer: question.answer,
        buyerCredits: updatedBuyer.creditBalance,
        authorCredits: updatedAuthor.creditBalance,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Purchase successful',
    });
  } catch (error: any) {
    console.error('Error processing purchase:', error);

    const errorMessage = error.message || 'Failed to process purchase';
    const statusCode = errorMessage.includes('Insufficient credits') ? 402 :
                      errorMessage.includes('not found') ? 404 :
                      errorMessage.includes('already purchased') ? 409 : 500;

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
});

router.post('/:id/answer', verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: questionId } = req.params;
    const { answer } = req.body;
    const userId = (req as any).user?.uid;

    if (!userId || !answer) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      res.status(404).json({ error: 'Question not found' });
      return;
    }

    if (question.authorId !== userId) {
      res.status(403).json({ error: 'Only the author can add an answer' });
      return;
    }

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: { answer },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        purchases: {
          select: {
            buyerId: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: updatedQuestion,
    });
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ error: 'Failed to add answer' });
  }
});

export default router;
