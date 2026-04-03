import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase';

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <div className="app-shell">
                <div className="app-frame">
                    <main className="app-main" style={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
                        <div className="panel" style={{ textAlign: 'center' }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', border: '3px solid #b4d6cb', borderTopColor: 'var(--accent)', margin: '0 auto', animation: 'spin 0.9s linear infinite' }} />
                            <p className="muted">Loading...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
