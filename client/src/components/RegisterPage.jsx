import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, BadgeCheck, Building2, FileText, GraduationCap } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        college: '',
        branch: '',
        cgpa: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Password and confirm password must match');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const token = await userCredential.user.getIdToken();

            const profileResponse = await fetch(`${API_BASE}/students/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    college: formData.college,
                    branch: formData.branch,
                    cgpa: formData.cgpa,
                }),
            });

            if (!profileResponse.ok) {
                const errorData = await profileResponse.json();
                throw new Error(errorData.error || 'Failed to create student profile');
            }

            navigate('/dashboard');
        } catch (err) {
            const code = err?.code;
            if (code === 'auth/email-already-in-use') {
                setError('This email is already in use');
            } else if (code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (code === 'auth/weak-password') {
                setError('Password should be at least 6 characters');
            } else {
                setError(err?.message || 'Failed to create account');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-shell">
            <div className="app-frame">
                <nav className="app-nav">
                    <div className="app-brand">CAMPUSVAULT</div>
                    <button onClick={() => navigate('/')} className="btn btn-secondary">Back</button>
                </nav>

                <main className="app-main grid-2">
                    <section className="panel fade-up">
                        <h1 className="hero-title">JOIN THE BATCH</h1>
                        <p className="muted">Build your profile once and unlock matching, assessments, and community guidance.</p>
                        <div className="stack compact-top">
                            <div className="card"><GraduationCap size={16} /> Academic profile mapping</div>
                            <div className="card"><Building2 size={16} /> Eligible company discovery</div>
                            <div className="card"><FileText size={16} /> Interview question feed</div>
                            <div className="card"><BadgeCheck size={16} /> Readiness validation</div>
                        </div>
                    </section>

                    <section className="panel fade-delay">
                        <h2 style={{ marginTop: 0 }}>Create Account</h2>
                        {error && <div className="card" style={{ borderColor: 'rgba(154,47,47,0.35)', color: '#8b2f2f' }}>{error}</div>}
                        <form onSubmit={handleSubmit} className="stack compact-top">
                            <div className="grid-2">
                                <label>First Name<input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required disabled={isLoading} className="field" /></label>
                                <label>Last Name<input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required disabled={isLoading} className="field" /></label>
                            </div>
                            <label>Email Address<input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isLoading} className="field" /></label>
                            <label>Phone Number<input type="tel" name="phone" value={formData.phone} onChange={handleChange} required disabled={isLoading} className="field" /></label>
                            <div className="grid-2">
                                <label>College Name<input type="text" name="college" value={formData.college} onChange={handleChange} required disabled={isLoading} className="field" /></label>
                                <label>Branch/Department
                                    <select name="branch" value={formData.branch} onChange={handleChange} required disabled={isLoading} className="select">
                                        <option value="">Select Branch</option>
                                        <option value="CSE">Computer Science</option>
                                        <option value="ECE">Electronics & Communication</option>
                                        <option value="ME">Mechanical Engineering</option>
                                        <option value="CE">Civil Engineering</option>
                                        <option value="EE">Electrical Engineering</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </label>
                            </div>
                            <label>CGPA<input type="number" name="cgpa" value={formData.cgpa} onChange={handleChange} required min="0" max="10" step="0.01" disabled={isLoading} className="field" /></label>
                            <div className="grid-2">
                                <label>Password<input type="password" name="password" value={formData.password} onChange={handleChange} required disabled={isLoading} className="field" /></label>
                                <label>Confirm Password<input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required disabled={isLoading} className="field" /></label>
                            </div>
                            <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">
                                {isLoading ? 'Creating account...' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Create Account <ArrowRight size={15} /></span>}
                            </button>
                            <div className="muted" style={{ textAlign: 'center' }}>
                                Already have an account? <button type="button" onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '6px 10px' }}>Sign in</button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}
