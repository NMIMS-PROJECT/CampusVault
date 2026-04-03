import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Award, Calendar } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [authToken, setAuthToken] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }
            const token = await user.getIdToken();
            setAuthToken(token);
            fetchProfile(token);
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchProfile = async (token) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/students/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data.data);
            } else {
                console.error('Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE}/students/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setProfile(formData);
                setIsEditing(false);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
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

    if (loading) {
        return <div className="app-shell"><div className="app-frame"><main className="app-main"><div className="panel">Loading profile...</div></main></div></div>;
    }

    if (!profile) {
        return <div className="app-shell"><div className="app-frame"><main className="app-main"><div className="panel">No profile data found</div></main></div></div>;
    }

    return (
        <div className="app-shell">
            <div className="app-frame">
                <nav className="app-nav">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary"><ArrowLeft size={16} /> Back</button>
                    <div className="app-brand">MY PROFILE</div>
                    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </nav>

                <main className="app-main grid-2">
                    <section className="panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <h2 style={{ margin: 0 }}>Profile Details</h2>
                            <button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="btn btn-primary" type="button">{isEditing ? 'Save Changes' : 'Edit Profile'}</button>
                        </div>
                        <div className="grid-2">
                            <label>First Name<input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} readOnly={!isEditing} className="field" /></label>
                            <label>Last Name<input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} readOnly={!isEditing} className="field" /></label>
                        </div>
                        <div className="card compact-top">
                            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={16} /> Contact Information</h3>
                            <div className="grid-2">
                                <label>Email<input type="email" value={formData.email || ''} readOnly className="field" /></label>
                                <label>Phone<input type="tel" value={formData.phone || ''} readOnly className="field" /></label>
                            </div>
                        </div>
                        <div className="card compact-top">
                            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: 8 }}><Award size={16} /> Education</h3>
                            <div className="grid-3">
                                <label>College<input type="text" value={formData.college || ''} readOnly className="field" /></label>
                                <label>Branch<input type="text" value={formData.branch || ''} readOnly className="field" /></label>
                                <label>CGPA<input type="number" value={formData.cgpa || ''} readOnly className="field" /></label>
                            </div>
                        </div>
                        <label className="compact-top">Bio / About
                            <textarea name="bio" value={formData.bio || ''} onChange={handleChange} readOnly={!isEditing} rows={4} className="textarea" placeholder="Tell us about yourself..." />
                        </label>
                    </section>

                    <section className="stack">
                        <div className="card"><strong>Skill Level</strong><p className="muted">{profile?.skillCategory || 'Beginner'}</p></div>
                        <div className="card"><strong>Credits Balance</strong><p className="muted">{profile?.creditBalance || 0}</p></div>
                        <div className="card"><strong>Member Since</strong><p className="muted" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Calendar size={14} /> {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p></div>
                        <div className="card">
                            <strong>Assessment</strong>
                            <button onClick={() => navigate('/assessment')} className="btn btn-primary btn-block compact-top" type="button">
                                {profile?.hasCompletedAssessment ? 'Retake Assessment' : 'Start Assessment'}
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
