import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function MentorshipPage() {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) navigate('/login');
            else fetchMentors();
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchMentors = async () => {
        try {
            const response = await fetch(`${API_BASE}/mentors`);
            if (response.ok) {
                const data = await response.json();
                setMentors(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSession = (mentor) => {
        alert(`Booking session with ${mentor.firstName}. Feature coming soon!`);
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
                    <div className="app-brand">EXPERT MENTORS</div>
                    <button onClick={handleLogout} className="btn btn-danger"><LogOut size={16} /> Logout</button>
                </nav>

                <main className="app-main">
                    <div className="panel" style={{ marginBottom: 12 }}>
                        <h2 style={{ marginTop: 0 }}>Learn from Industry Experts</h2>
                        <p className="muted">Get personalized guidance from experienced professionals.</p>
                    </div>

                    {loading ? (
                        <div className="panel">Loading mentors...</div>
                    ) : mentors.length === 0 ? (
                        <div className="panel">No mentors available</div>
                    ) : (
                        <div className="grid-3">
                            {mentors.map((mentor) => (
                                <div key={mentor.id} className="card">
                                    {mentor.isVerified && <span className="badge">Verified</span>}
                                    <h3>{mentor.firstName} {mentor.lastName}</h3>
                                    <div className="muted" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <Briefcase size={14} /> {mentor.designation}
                                    </div>
                                    <p className="muted">{mentor.company}</p>
                                    {mentor.bio && <p className="muted">{mentor.bio}</p>}
                                    <div className="grid-2">
                                        <div className="card"><strong>{mentor.experience}+</strong><div className="muted">Years</div></div>
                                        <div className="card"><strong>₹{mentor.hourlyRate}/hr</strong><div className="muted">Rate</div></div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                                        {mentor.expertise?.slice(0, 3).map((skill) => <span key={skill} className="badge">{skill}</span>)}
                                    </div>
                                    <button onClick={() => handleBookSession(mentor)} className="btn btn-primary btn-block" style={{ marginTop: 10 }}>Book Session</button>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
