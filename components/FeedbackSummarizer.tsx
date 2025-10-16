import React, { useState, useEffect } from 'react';
import { summarizeFeedback } from '../services/geminiService';
import { FeedbackSummary, Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';

interface FeedbackState {
    feedbackText: string;
    summary: FeedbackSummary | null;
}

const FeedbackSummarizer: React.FC = () => {
    const [feedbackText, setFeedbackText] = useState('');
    const [summary, setSummary] = useState<FeedbackSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedState = loadStateForTab<FeedbackState>(Tab.Feedback);
        if (savedState) {
            setFeedbackText(savedState.feedbackText || '');
            setSummary(savedState.summary || null);
        }
    }, []);

    const handleGenerate = async () => {
        if (!feedbackText.trim()) {
            setError('Please enter some customer feedback.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSummary(null);
        try {
            const result = await summarizeFeedback(feedbackText);
            setSummary(result);
            saveStateForTab(Tab.Feedback, { feedbackText, summary: result });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const styles = {
        container: { padding: '20px', border: '1px solid #eee', borderRadius: '8px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        textarea: { width: '100%', minHeight: '150px', padding: '10px', boxSizing: 'border-box' as 'border-box', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' },
        button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px' },
        error: { color: 'red', marginTop: '10px' },
        summarySection: { marginBottom: '20px' },
        summaryTitle: { fontWeight: 'bold', color: '#333' },
        ul: { paddingLeft: '20px', listStyleType: 'disc', margin: '10px 0' }
    };

    return (
        <div style={styles.container}>
            <h2>Feedback Summarizer</h2>
            <p>Paste in customer feedback (e.g., reviews, survey responses) to get a high-level summary.</p>

            <label htmlFor="feedback-text" style={styles.label}>Customer Feedback:</label>
            <textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Paste customer reviews here..."
                style={styles.textarea}
                rows={8}
            />

            <button onClick={handleGenerate} disabled={isLoading} style={styles.button}>
                {isLoading ? 'Summarizing...' : 'Summarize Feedback'}
            </button>

            {isLoading && <LoadingSpinner />}
            {error && <p style={styles.error}>{error}</p>}
            
            {summary && (
                <ResultCard title="Feedback Summary">
                    <div style={styles.summarySection}>
                        <h4 style={styles.summaryTitle}>✅ Positive Themes</h4>
                        <ul style={styles.ul}>
                            {summary.positiveThemes.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    <div style={styles.summarySection}>
                        <h4 style={styles.summaryTitle}>🤔 Areas for Improvement</h4>
                        <ul style={styles.ul}>
                            {summary.areasForImprovement.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    <div style={styles.summarySection}>
                        <h4 style={styles.summaryTitle}>💡 Actionable Suggestions</h4>
                        <ul style={styles.ul}>
                            {summary.actionableSuggestions.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                </ResultCard>
            )}
        </div>
    );
};

export default FeedbackSummarizer;
