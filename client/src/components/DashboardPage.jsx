import { useNavigate } from 'react-router-dom';
import { LogOut, TrendingUp, Users, Briefcase, User, BookOpen, Medal, ArrowUpRight, Rocket, Target } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import CompanyMatcher from './CompanyMatcher';
import QuestionForum from './QuestionForum';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        let mounted = true;

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!mounted) return;

            if (!user) {
                setAuthToken('');
                setCurrentUserId('');
                return;
            }

            const token = await user.getIdToken();
            if (mounted) {
                setAuthToken(token);
                setCurrentUserId(user.uid);
                setUserName(user.email?.split('@')[0] || 'Student');
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    const mainFeatures = [
        {
            icon: Briefcase,
            title: 'Browse Placements',
            description: 'Explore 100+ job opportunities',
            action: () => navigate('/placements'),
            badge: 'Opportunities',
        },
        {
            icon: Users,
            title: 'Expert Mentors',
            description: 'Get guidance from industry leaders',
            action: () => navigate('/mentors'),
            badge: 'Mentorship',
        },
        {
            icon: Medal,
            title: 'Skill Assessment',
            description: 'Test your technical skills',
            action: () => navigate('/assessment'),
            badge: 'Readiness',
        },
    ];

    const sideFeatures = [
        {
            icon: User,
            title: 'My Profile',
            description: 'View and edit your profile',
            action: () => navigate('/profile'),
        },
        {
            icon: TrendingUp,
            title: 'Market Value',
            description: 'Check market trends and salaries',
            action: () => navigate('/market-value'),
        },
        {
            icon: BookOpen,
            title: 'Q&A Forum',
            description: 'Ask questions and share insights',
            action: () => window.scrollTo({ top: 1500, behavior: 'smooth' }),
        },
    ];

    return (
        <div className="app-shell">
            <div className="app-frame">
                <nav className="app-nav">
                    <div>
                        <div className="app-brand">CAMPUSVAULT</div>
                        <div className="muted" style={{ fontSize: 12 }}>Placement Command Center</div>
                    </div>
                    <button onClick={handleLogout} className="btn btn-danger" type="button"><LogOut size={15} /> Logout</button>
                </nav>

                <main className="app-main">
                    <section className="grid-2">
                        <div className="panel fade-up">
                            <p className="badge"><Rocket size={12} /> Active Preparation Window</p>
                            <h1 className="hero-title" style={{ marginTop: 10 }}>READY, {userName?.toUpperCase()}?</h1>
                            <p className="muted">Prioritize interviews, close skill gaps, and move from preparation to offers.</p>
                            <div className="grid-3 compact-top">
                                <div className="card"><strong>Weekly Focus</strong><div className="muted">Aptitude + DSA</div></div>
                                <div className="card"><strong>Top Signal</strong><div className="muted">Mock Interview</div></div>
                                <div className="card"><strong>Career Goal</strong><div className="muted">SDE Role</div></div>
                            </div>
                        </div>

                        <div className="panel fade-delay">
                            <h3 style={{ marginTop: 0 }}>Preparation Pulse</h3>
                            <div className="stack">
                                <div className="card"><strong>Momentum:</strong> Strong</div>
                                <div className="card"><strong>Interview Readiness:</strong> Growing</div>
                                <button onClick={() => navigate('/assessment')} className="btn btn-primary btn-block" type="button">Run Skill Check <ArrowUpRight size={15} /></button>
                            </div>
                        </div>
                    </section>

                    <section className="compact-top">
                        <h3 style={{ marginBottom: 12 }}>Priority Actions</h3>
                        <div className="grid-3">
                            {mainFeatures.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <button key={feature.title} onClick={feature.action} className="card" style={{ textAlign: 'left', cursor: 'pointer' }}>
                                        <p className="badge">{feature.badge}</p>
                                        <div style={{ marginTop: 10 }}><Icon size={20} /></div>
                                        <h4 style={{ marginBottom: 4 }}>{feature.title}</h4>
                                        <p className="muted" style={{ margin: 0 }}>{feature.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="compact-top">
                        <h3 style={{ marginBottom: 12 }}>Quick Navigation</h3>
                        <div className="grid-3">
                            {sideFeatures.map((feature) => {
                                const Icon = feature.icon;
                                return (
                                    <button key={feature.title} onClick={feature.action} className="card" style={{ textAlign: 'left', cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <Icon size={18} />
                                            <div>
                                                <strong>{feature.title}</strong>
                                                <p className="muted" style={{ margin: 0 }}>{feature.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="compact-top">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Target size={18} /> Eligible Companies for You</h3>
                        <CompanyMatcher authToken={authToken} />
                    </section>

                    <section className="compact-top">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BookOpen size={18} /> Community Q&A Forum</h3>
                        <QuestionForum authToken={authToken} currentUserId={currentUserId} />
                    </section>
                </main>
            </div>
        </div>
    );
}
