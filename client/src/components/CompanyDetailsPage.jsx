import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCompanyDetails } from '../api/companyAPI';
import { fetchQuestions } from '../api/questionAPI';

export default function CompanyDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const loadCompanyData = async () => {
            try {
                setLoading(true);
                setError('');

                if (!id) {
                    setError('Company ID not found');
                    return;
                }

                const companyData = await fetchCompanyDetails(id);
                setCompany(companyData);

                const forumQuestions = await fetchQuestions({ company: companyData.name });
                setQuestions(forumQuestions);
            } catch (err) {
                setError(err?.message || 'Failed to load company details');
            } finally {
                setLoading(false);
            }
        };

        loadCompanyData();
    }, [id]);

    if (loading) {
        return <div className="app-shell"><div className="app-frame"><main className="app-main"><div className="panel">Loading company details...</div></main></div></div>;
    }

    if (error || !company) {
        return (
            <div className="app-shell">
                <div className="app-frame">
                    <main className="app-main">
                        <div className="panel" style={{ color: '#8b2f2f' }}>
                            <h2 style={{ marginTop: 0 }}>Error</h2>
                            <p>{error || 'Company not found'}</p>
                            <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <div className="app-frame">
                <main className="app-main">
                    <div className="panel">
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                        <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            {company.logo && <img src={company.logo} alt={company.name} style={{ height: 64, width: 64, objectFit: 'contain' }} />}
                            <div style={{ flex: 1, minWidth: 260 }}>
                                <h1 style={{ margin: 0 }}>{company.name}</h1>
                                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                    <span className="badge">{company.industry}</span>
                                    <span className="badge">{company.location}</span>
                                </div>
                                {company.description && <p className="muted">{company.description}</p>}
                                <div className="grid-3">
                                    <div className="card"><span className="muted">Min GPA</span><strong>{company.minGpa}</strong></div>
                                    <div className="card"><span className="muted">Open Positions</span><strong>{company.placements?.length || 0}</strong></div>
                                    <div className="card"><span className="muted">Discussions</span><strong>{questions.length}</strong></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className={activeTab === 'overview' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setActiveTab('overview')}>Overview</button>
                        <button className={activeTab === 'placements' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setActiveTab('placements')}>Placements ({company.placements?.length || 0})</button>
                        <button className={activeTab === 'discussions' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setActiveTab('discussions')}>Discussions ({questions.length})</button>
                    </div>

                    <div style={{ marginTop: 12 }}>
                {activeTab === 'overview' && (
                    <div>
                        <div className="grid-2">
                            {company.requiredSkills && company.requiredSkills.length > 0 && (
                                <div className="card">
                                    <h3 style={{ marginTop: 0 }}>Required Skills</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {company.requiredSkills.map((skill) => (
                                            <div key={skill} className="badge">{skill}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {company.companyPrepResources && company.companyPrepResources.length > 0 && (
                                <div className="card">
                                    <h3 style={{ marginTop: 0 }}>Preparation Resources</h3>
                                    <div className="stack">
                                        {company.companyPrepResources.map((resource) => (
                                            <div key={resource.id} className="card">
                                                <div className="muted">{resource.resourceType}</div>
                                                <div><strong>{resource.title}</strong></div>
                                                {resource.fileUrl && (
                                                    <a
                                                        href={resource.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-secondary"
                                                        style={{ marginTop: 8, display: 'inline-flex' }}
                                                    >
                                                        Download
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'placements' && (
                    <div>
                        {company.placements && company.placements.length > 0 ? (
                            <div className="stack">
                                {company.placements.map((placement) => (
                                    <div key={placement.id} className="card">
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}>
                                            <h3 style={{ margin: 0 }}>{placement.position}</h3>
                                            <div className="badge">
                                                ₹{(placement.ctc || placement.salary || 0).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="grid-2 compact-top">
                                            <div className="card">
                                                <strong>Salary Type:</strong>
                                                <span className="ml-2">{placement.salaryType}</span>
                                            </div>
                                            <div className="card">
                                                <strong>Location:</strong>
                                                <span className="ml-2">{placement.location}</span>
                                            </div>
                                        </div>

                                        {placement.description && (
                                            <div className="card compact-top">
                                                <strong>Description:</strong>
                                                <p className="muted">{placement.description}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card">No placements available at the moment.</div>
                        )}
                    </div>
                )}

                {activeTab === 'discussions' && (
                    <div>
                        {questions.length > 0 ? (
                            <div className="stack">
                                {questions.map((question) => (
                                    <div key={question.id} className="card">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                                            <h4 style={{ margin: 0 }}>{question.title}</h4>
                                            {question.isPaid && <span className="badge">Paid</span>}
                                        </div>
                                        <p className="muted">{question.text}</p>
                                        <div className="muted" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 12 }}>
                                            <span>By: {question.author.firstName} {question.author.lastName}</span>
                                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                                            {question.answer && <span className="badge">Answered</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card">
                                <p>No discussions yet. Be the first to ask a question!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
                </main>
            </div>
        </div>
    );
}
