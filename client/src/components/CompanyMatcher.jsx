import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEligibleCompanies } from '../api/companyAPI';

export const CompanyMatcher = ({ authToken }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEligibleCompanies = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchEligibleCompanies(authToken);
                setCompanies(data);
            } catch (err) {
                setError(err?.message || 'Failed to load companies');
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            loadEligibleCompanies();
        }
    }, [authToken]);

    if (loading) {
        return <div className="panel">Loading eligible companies...</div>;
    }

    if (error) {
        return <div className="panel" style={{ color: '#8b2f2f' }}>Error: {error}</div>;
    }

    return (
        <div className="panel">
            <div style={{ marginBottom: 12 }}>
                <h2 style={{ margin: 0 }}>Company Matcher</h2>
                <p className="muted">Showing {companies.length} eligible companies for you</p>
            </div>

            {companies.length === 0 ? (
                <div className="card" style={{ textAlign: 'center' }}>
                    <p>No eligible companies found. Keep improving your GPA!</p>
                </div>
            ) : (
                <div className="grid-2">
                    {companies.map((company) => (
                        <Link key={company.id} to={`/company/${company.id}`} className="group block">
                            <div className="card" style={{ height: '100%' }}>
                                {company.logo && <img src={company.logo} alt={company.name} className="mb-4 h-12 w-12 rounded-md object-contain" />}

                                <div>
                                    <h3 style={{ margin: 0 }}>{company.name}</h3>

                                    <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        <span className="badge">{company.industry}</span>
                                        <span className="badge">{company.location}</span>
                                    </div>

                                    <div className="stack compact-top" style={{ fontSize: 14 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>Min GPA Required:</strong>
                                            <span>{company.minGpa}</span>
                                        </div>

                                        {company.visitingDate && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <strong>Visiting Date:</strong>
                                                <span>{new Date(company.visitingDate).toLocaleDateString()}</span>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>Open Positions:</strong>
                                            <span>{company.placements?.length || 0}</span>
                                        </div>

                                        {company.requiredSkills && company.requiredSkills.length > 0 && (
                                            <div>
                                                <strong>Required Skills:</strong>
                                                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    {company.requiredSkills.map((skill) => (
                                                        <span key={skill} className="badge">{skill}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {company.placements && company.placements.length > 0 && (
                                        <div className="card" style={{ marginTop: 10 }}>
                                            <strong>Top Salary Offered:</strong>
                                            <span style={{ marginLeft: 8 }}>₹{Math.max(...company.placements.map((placement) => placement.salary || 0)).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: 12 }}>
                                    <button className="btn btn-primary btn-block">View Details</button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompanyMatcher;
