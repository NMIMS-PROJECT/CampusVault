import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Calendar, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function PlacementsPage() {
    const navigate = useNavigate();
    const [placements, setPlacements] = useState([]);
    const [applications, setApplications] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState('');
    const [applyingId, setApplyingId] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }
            const token = await user.getIdToken();
            setAuthToken(token);
            fetchPlacements(token);
            fetchApplications(token);
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchPlacements = async (token) => {
        try {
            const response = await fetch(`${API_BASE}/placements`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setPlacements(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching placements:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (token) => {
        try {
            const response = await fetch(`${API_BASE}/placements/student/applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                const appliedIds = new Set(data.data.map((app) => app.placementId));
                setApplications(appliedIds);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    const handleApply = async (placementId) => {
        try {
            setApplyingId(placementId);
            const response = await fetch(`${API_BASE}/placements/apply/${placementId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (response.ok) {
                setApplications((prev) => new Set([...prev, placementId]));
                alert('Applied successfully!');
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to apply');
            }
        } catch (error) {
            console.error('Error applying:', error);
        } finally {
            setApplyingId(null);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="app-shell">
            <div className="app-frame">
                <nav className="app-nav">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary"><ArrowLeft size={16} /> Back</button>
                    <div className="app-brand">ACTIVE PLACEMENTS</div>
                    <button onClick={handleLogout} className="btn btn-danger"><LogOut size={16} /> Logout</button>
                </nav>

                <main className="app-main">
                    {loading ? (
                        <div className="panel">Loading placements...</div>
                    ) : placements.length === 0 ? (
                        <div className="panel">No placements available</div>
                    ) : (
                        <div className="grid-2">
                            {placements.map((p) => (
                                <div key={p.id} className="card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                                        <div>
                                            <p className="muted" style={{ margin: 0 }}>{p.company?.name}</p>
                                            <h3 style={{ margin: '3px 0 0 0' }}>{p.position}</h3>
                                        </div>
                                        {applications.has(p.id) && <span className="badge">Applied</span>}
                                    </div>

                                    <div className="stack compact-top">
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><DollarSign size={16} /> ₹{(p.ctc || p.salary).toLocaleString()} CTC</div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><MapPin size={16} /> {p.location}</div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Calendar size={16} /> Deadline: {new Date(p.deadline).toLocaleDateString()}</div>
                                    </div>

                                    {p.description && <p className="muted">{p.description}</p>}

                                    <button
                                        onClick={() => handleApply(p.id)}
                                        disabled={applications.has(p.id) || applyingId === p.id}
                                        className="btn btn-primary btn-block"
                                        type="button"
                                    >
                                        {applyingId === p.id ? 'Applying...' : applications.has(p.id) ? 'Already Applied' : 'Apply Now'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
