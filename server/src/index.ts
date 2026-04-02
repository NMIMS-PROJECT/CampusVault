import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import questionRoutes from './routes/questionRoutes.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Campus Placement Platform API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/questions', questionRoutes);

app.use('/api/auth', (req, res) => {
  res.status(200).json({ message: 'Auth routes - coming soon' });
});

app.use('/api/students', (req, res) => {
  res.status(200).json({ message: 'Student routes - coming soon' });
});

app.use('/api/mentors', (req, res) => {
  res.status(200).json({ message: 'Mentor routes - coming soon' });
});

app.use('/api/placements', (req, res) => {
  res.status(200).json({ message: 'Placement routes - coming soon' });
});

app.use('/api/companies', (req, res) => {
  res.status(200).json({ message: 'Company routes - coming soon' });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(\🚀 Campus Placement Platform Server running on port \\);
  console.log(\📍 Environment: \\);
  console.log(\🔗 CORS Origin: \\);
});

export default app;
