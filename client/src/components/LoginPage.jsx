import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, ShieldCheck, Target, Zap } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        setIsLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            const code = err?.code;
            if (code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else if (code === 'auth/invalid-credential') {
                setError('Invalid email or password');
            } else if (code === 'auth/user-not-found') {
                setError('No account found with this email');
            } else if (code === 'auth/wrong-password') {
                setError('Incorrect password');
            } else if (code === 'auth/too-many-requests') {
                setError('Too many failed login attempts. Please try again later');
            } else {
                setError(err?.message || 'Failed to sign in. Please try again');
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
                        <p className="badge"><Target size={14} /> Placement Command Center</p>
                        <h1 className="hero-title" style={{ marginTop: 12 }}>WELCOME BACK</h1>
                        <p className="muted">Continue your preparation streak with company insights, skill checks, and forum learning.</p>
                        <div className="grid-3 compact-top">
                            <div className="card"><ShieldCheck size={16} /><p>Secure Auth</p></div>
                            <div className="card"><Zap size={16} /><p>Daily Drills</p></div>
                            <div className="card"><ArrowRight size={16} /><p>Career Focus</p></div>
                        </div>
                    </section>

                    <section className="panel fade-delay">
                        <h2 style={{ marginTop: 0 }}>Sign In</h2>
                        {error && <div className="card" style={{ borderColor: 'rgba(154,47,47,0.35)', color: '#8b2f2f' }}>{error}</div>}
                        <form onSubmit={handleSubmit} className="stack compact-top">
                            <label>
                                Email Address
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isLoading} className="field" placeholder="your@email.com" />
                            </label>
                            <label>
                                Password
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required disabled={isLoading} className="field" placeholder="********" />
                            </label>
                            <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">{isLoading ? 'Signing in...' : 'Enter Dashboard'}</button>
                            <div className="muted" style={{ textAlign: 'center' }}>
                                Don&apos;t have an account? <button type="button" onClick={() => navigate('/register')} className="btn btn-secondary" style={{ padding: '6px 10px' }}>Create one</button>
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}
