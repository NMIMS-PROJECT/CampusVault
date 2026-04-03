// No external imports needed for this component

export const QuestionCard = ({ question, currentUserId, hasPurchased = false, onPurchase, isLoadingPurchase = false }) => {
    const isAuthor = currentUserId === question.author.id;
    const isBlurred = !hasPurchased && question.isPaid;

    const handleUnlock = async () => {
        if (onPurchase) {
            try {
                await onPurchase(question.id);
            } catch (error) {
                console.error('Failed to unlock:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}>
                <h3 style={{ margin: 0 }}>{question.title}</h3>
                <span className="badge">{question.company}</span>
            </div>

            <div className="muted" style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 12 }}>
                <span>By {question.author.firstName} {question.author.lastName}</span>
                <span>{formatDate(question.createdAt)}</span>
                {question.isPaid && <span className="badge">{question.cost} Credits</span>}
            </div>

            <div className="stack compact-top">
                <div className="card">
                    <p>{question.text}</p>
                </div>

                {question.answer && (
                    <div className="card" style={{ position: 'relative', overflow: isBlurred ? 'hidden' : 'visible' }}>
                        <h4 style={{ margin: '0 0 8px 0' }}>Answer:</h4>
                        <p>{question.answer}</p>

                        {isBlurred && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(13,42,43,0.72)' }}>
                                <div className="card" style={{ textAlign: 'center' }}>
                                    <p>Answer is locked</p>
                                    <button
                                        onClick={handleUnlock}
                                        disabled={isLoadingPurchase || isAuthor}
                                        className="btn btn-primary"
                                        title={isAuthor ? 'You cannot purchase your own question' : 'Click to unlock'}
                                    >
                                        {isLoadingPurchase ? 'Unlocking...' : `Unlock for ${question.cost} Credits`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="muted" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span>{question.purchases.length} person{question.purchases.length !== 1 ? 's' : ''} purchased</span>
                {isAuthor && <span className="badge">You are the author</span>}
            </div>
        </div>
    );
};

export default QuestionCard;
