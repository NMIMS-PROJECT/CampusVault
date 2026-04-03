import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const assessmentQuestions = [
    {
        id: 1,
        question: 'What is a variable in programming?',
        options: ['A storage location', 'A function', 'A loop', 'A module'],
        correctAnswer: 0,
    },
    {
        id: 2,
        question: 'Which data structure uses LIFO?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
    },
    {
        id: 3,
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
        correctAnswer: 2,
    },
    {
        id: 4,
        question: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query List', 'Structured Question List', 'Simple Query Language'],
        correctAnswer: 0,
    },
    {
        id: 5,
        question: 'Which sorting algorithm has the best average-case complexity?',
        options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
        correctAnswer: 1,
    },
];

export default function AssessmentPage() {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [skillCategory, setSkillCategory] = useState('');
    const [authToken, setAuthToken] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) navigate('/login');
            else setAuthToken(await user.getIdToken());
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleAnswer = (index) => {
        setAnswers({ ...answers, [currentQuestion]: index });
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < assessmentQuestions.length) {
            alert('Please answer all questions');
            return;
        }

        try {
            const answerData = assessmentQuestions.map((q, idx) => ({
                questionId: q.id,
                selectedOptionIndex: answers[idx],
            }));

            const response = await fetch(`${API_BASE}/assessment/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ answers: answerData }),
            });

            if (response.ok) {
                const data = await response.json();
                setScore(data.score);
                setSkillCategory(data.skillCategory);
                setSubmitted(true);
            }
        } catch (error) {
            console.error('Error submitting assessment:', error);
            alert('Failed to submit assessment');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <div className="app-shell">
            <div className="app-frame">
                <nav className="app-nav">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary"><ArrowLeft size={16} /> Back</button>
                    <div className="app-brand">SKILL ASSESSMENT</div>
                    <button onClick={handleLogout} className="btn btn-danger"><LogOut size={16} /> Logout</button>
                </nav>

                <main className="app-main" style={{ maxWidth: 900 }}>
                    {!submitted ? (
                        <div className="panel">
                            <div style={{ marginBottom: 14 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h2 style={{ margin: 0 }}>Question {currentQuestion + 1}/{assessmentQuestions.length}</h2>
                                    <span className="muted">{Math.round(((currentQuestion + 1) / assessmentQuestions.length) * 100)}%</span>
                                </div>
                                <div style={{ width: '100%', background: '#d8e7e2', borderRadius: 999, height: 8, marginTop: 8 }}>
                                    <div style={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%`, background: 'var(--accent)', height: 8, borderRadius: 999 }} />
                                </div>
                            </div>

                            <h3>{assessmentQuestions[currentQuestion].question}</h3>
                            <div className="stack">
                                {assessmentQuestions[currentQuestion].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className="btn btn-secondary"
                                        style={{ borderRadius: 12, textAlign: 'left', background: answers[currentQuestion] === idx ? 'rgba(0,122,100,0.13)' : '#fff' }}
                                        type="button"
                                    >
                                        <strong>{String.fromCharCode(65 + idx)}.</strong> {option}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 14 }}>
                                <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0} className="btn btn-secondary" type="button">Previous</button>
                                {currentQuestion === assessmentQuestions.length - 1 ? (
                                    <button onClick={handleSubmit} className="btn btn-primary" type="button">Submit Assessment</button>
                                ) : (
                                    <button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="btn btn-primary" type="button">Next</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="panel" style={{ textAlign: 'center' }}>
                            <h2 style={{ marginTop: 0 }}>Assessment Complete</h2>
                            <div className="card" style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 48, fontWeight: 700 }}>{score}%</div>
                                <p className="muted">Your Score</p>
                                <div className="card">
                                    <strong>{skillCategory}</strong>
                                    <p className="muted">
                                        {score >= 80
                                            ? 'Excellent! You are ready for advanced interviews.'
                                            : score >= 60
                                            ? 'Good! You are interview-ready. Keep practicing!'
                                            : 'Keep practicing! Review the basics and retake the assessment.'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-block" type="button">Back to Dashboard</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
