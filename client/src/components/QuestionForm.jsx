import { useState } from 'react';

export const QuestionForm = ({ onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        text: '',
        isPaid: false,
        cost: '',
    });

    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value, type } = event.target;

        if (type === 'checkbox') {
            const checkbox = event.target;
            setFormData((prev) => ({
                ...prev,
                [name]: checkbox.checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!formData.title || !formData.company || !formData.text) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.isPaid && (!formData.cost || parseInt(formData.cost) <= 0)) {
            setError('Please enter a valid cost for paid questions');
            return;
        }

        try {
            await onSubmit({
                title: formData.title,
                company: formData.company,
                text: formData.text,
                isPaid: formData.isPaid,
                cost: formData.isPaid ? parseInt(formData.cost) : undefined,
            });

            setFormData({
                title: '',
                company: '',
                text: '',
                isPaid: false,
                cost: '',
            });
        } catch (err) {
            setError(err.message || 'Failed to post question');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="stack">
            <h2 style={{ margin: 0 }}>Post a Question</h2>

            <div className="stack" style={{ gap: 4 }}>
                <label htmlFor="title">Title *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="What's your question?"
                    className="field"
                    required
                />
            </div>

            <div className="stack" style={{ gap: 4 }}>
                <label htmlFor="company">Company *</label>
                <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Google, Microsoft, Amazon"
                    className="field"
                    required
                />
            </div>

            <div className="stack" style={{ gap: 4 }}>
                <label htmlFor="text">Question Details *</label>
                <textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="Provide details about your question..."
                    rows={5}
                    className="textarea"
                    required
                />
            </div>

            <div className="card">
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
                    <span>This is a paid question</span>
                </label>
            </div>

            {formData.isPaid && (
                <div className="stack" style={{ gap: 4 }}>
                    <label htmlFor="cost">Cost (Credits) *</label>
                    <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        placeholder="e.g., 50"
                        min="1"
                        className="field"
                        required
                    />
                </div>
            )}

            {error && <div className="card" style={{ borderColor: 'rgba(154,47,47,0.35)', color: '#8b2f2f' }}>{error}</div>}

            <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">
                {isLoading ? 'Posting...' : 'Post Question'}
            </button>
        </form>
    );
};

export default QuestionForm;
