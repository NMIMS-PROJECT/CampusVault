import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Briefcase, BarChart3, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function MarketValuePage() {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }
            const token = await user.getIdToken();
            fetchMarketData(token);
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchMarketData = async (token) => {
        try {
            const [analyticsRes, recsRes] = await Promise.all([
                fetch(`${API_BASE}/dashboard/analytics`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${API_BASE}/dashboard/recommendations`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (analyticsRes.ok) {
                // Analytics used for future enhancements
            }
            if (recsRes.ok) {
                const recData = await recsRes.json();
                setRecommendations(recData.data);
            }
        } catch (error) {
            console.error('Error fetching market data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    return (
        <div className="app-shell">
            <div className="app-frame">
                <nav className="app-nav">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary"><ArrowLeft size={16} /> Back</button>
                    <div className="app-brand">MARKET VALUE</div>
                    <button onClick={handleLogout} className="btn btn-danger"><LogOut size={16} /> Logout</button>
                </nav>

                <main className="app-main">
                    <div className="panel" style={{ marginBottom: 12 }}>
                        <h1 className="hero-title">YOUR MARKET VALUE</h1>
                        <p className="muted">Comprehensive analysis of your market position and salary trends.</p>
                    </div>

                    {loading ? (
                        <div className="panel">Loading market data...</div>
                    ) : (
                        <>
                            <div className="grid-3" style={{ marginBottom: 12 }}>
                                <div className="card"><TrendingUp size={20} /><h3>₹8.5 LPA</h3><p className="muted">Average Salary</p></div>
                                <div className="card"><Briefcase size={20} /><h3>{recommendations?.eligibleCompanies?.length || 25}+</h3><p className="muted">Companies Hiring</p></div>
                                <div className="card"><BarChart3 size={20} /><h3>High</h3><p className="muted">Market Demand</p></div>
                            </div>

                            {recommendations?.eligibleCompanies && recommendations.eligibleCompanies.length > 0 && (
                                <div className="panel" style={{ marginBottom: 12 }}>
                                    <h2 style={{ marginTop: 0 }}>Top Companies for You</h2>
                                    <div className="grid-2">
                                        {recommendations.eligibleCompanies.slice(0, 6).map((company) => (
                                            <div key={company.id} className="card">
                                                <h3 style={{ margin: 0 }}>{company.name}</h3>
                                                <p className="muted">{company.description}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>{company.location}</span>
                                                    <span className="badge">{company.placements?.length || 0} openings</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="panel">
                                <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 0 }}><BarChart3 size={22} /> Detailed Analysis</h2>
                                <div className="stack muted">
                                    <div>Skills in high demand: DSA, Backend Development, System Design</div>
                                    <div>Expected salary range: ₹7.5 - 9.5 LPA</div>
                                    <div>Top hiring industries: IT, Financial Services, E-commerce</div>
                                    <div>Recommended upgrades: System Design, Kubernetes, Microservices</div>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
