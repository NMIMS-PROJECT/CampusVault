import { useEffect, useState, useCallback } from 'react';
import QuestionForm from './QuestionForm';
import QuestionCard from './QuestionCard';

export const QuestionForum = ({ authToken, currentUserId }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [filterCompany, setFilterCompany] = useState('');
    const [filterPaidOnly, setFilterPaidOnly] = useState(false);
    const [purchasedQuestions, setPurchasedQuestions] = useState(new Set());
    const [isPosting, setIsPosting] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(null);
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const fetchQuestions = useCallback(async () => {
        try {
            setLoading(true);
            let url = `${API_BASE}/questions`;
            const params = new URLSearchParams();
            if (filterCompany) {
                params.append('company', filterCompany);
            }
            if (filterPaidOnly) {
                params.append('isPaid', 'true');
            }
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }

            const data = await response.json();
            setQuestions(data.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    }, [filterCompany, filterPaidOnly, API_BASE]);

    const checkPurchaseStatus = useCallback(async () => {
        if (!authToken || !currentUserId) {
            return;
        }

        try {
            const purchased = new Set();

            for (const question of questions) {
                try {
                    const response = await fetch(`${API_BASE}/questions/${question.id}/has-purchased`, {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.hasPurchased) {
                            purchased.add(question.id);
                        }
                    }
                } catch (err) {
                    console.error(`Failed to check purchase status for question ${question.id}:`, err);
                }
            }

            setPurchasedQuestions(purchased);
        } catch (err) {
            console.error('Failed to check purchase status:', err);
        }
    }, [authToken, currentUserId, questions, API_BASE]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    useEffect(() => {
        if (questions.length > 0) {
            checkPurchaseStatus();
        }
    }, [checkPurchaseStatus, questions]);

    const handlePostQuestion = async (formData) => {
        if (!authToken) {
            setError('You must be logged in to post a question');
            return;
        }

        try {
            setIsPosting(true);
            setError('');
            const response = await fetch(`${API_BASE}/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to post question');
            }

            setSuccessMessage('Question posted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            await fetchQuestions();
        } catch (err) {
            setError(err.message || 'Failed to post question');
        } finally {
            setIsPosting(false);
        }
    };

    const handlePurchase = async (questionId) => {
        if (!authToken) {
            setError('You must be logged in to purchase');
            return;
        }

        try {
            setIsPurchasing(questionId);
            setError('');
            const response = await fetch(`${API_BASE}/questions/${questionId}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to purchase answer');
            }

            const data = await response.json();
            setSuccessMessage(`Answer unlocked! You now have ${data.data.buyerCredits} credits.`);
            setTimeout(() => setSuccessMessage(''), 3000);
            setPurchasedQuestions((prev) => new Set([...prev, questionId]));
            await fetchQuestions();
        } catch (err) {
            setError(err.message || 'Failed to purchase answer');
        } finally {
            setIsPurchasing(null);
        }
    };

    return (
        <div className="panel">
            <header style={{ marginBottom: 14 }}>
                <h1 style={{ margin: 0 }}>Q&amp;A Forum</h1>
                <p className="muted">Ask questions and unlock expert answers</p>
            </header>

            {error && <div className="card" style={{ borderColor: 'rgba(154,47,47,0.35)', color: '#8b2f2f', marginBottom: 10 }}>{error}</div>}
            {successMessage && <div className="card" style={{ borderColor: 'rgba(0,122,100,0.35)', color: '#0a5a49', marginBottom: 10 }}>{successMessage}</div>}

            {authToken && (
                <div className="card" style={{ marginBottom: 14 }}>
                    <QuestionForm onSubmit={handlePostQuestion} isLoading={isPosting} />
                </div>
            )}

            <div className="grid-2" style={{ marginBottom: 14 }}>
                <input
                    type="text"
                    placeholder="Filter by company..."
                    value={filterCompany}
                    onChange={(event) => setFilterCompany(event.target.value)}
                    className="field"
                />

                <div className="card" style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            type="checkbox"
                            checked={filterPaidOnly}
                            onChange={(event) => setFilterPaidOnly(event.target.checked)}
                        />
                        <span>Paid Questions Only</span>
                    </label>
                </div>
            </div>

            <div>
                {loading && <div className="card">Loading questions...</div>}

                {!loading && questions.length === 0 && (
                    <div className="card" style={{ textAlign: 'center' }}>
                        <p>No questions found. Be the first to post one!</p>
                    </div>
                )}

                {!loading && questions.length > 0 && (
                    <div>
                        <h2 style={{ marginBottom: 10 }}>Recent Questions ({questions.length})</h2>
                        <div className="stack">
                        {questions.map((question) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                currentUserId={currentUserId}
                                hasPurchased={purchasedQuestions.has(question.id)}
                                onPurchase={handlePurchase}
                                isLoadingPurchase={isPurchasing === question.id}
                            />
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionForum;
