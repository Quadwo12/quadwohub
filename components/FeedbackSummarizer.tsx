import React, { useState, useEffect } from 'react';
import { summarizeFeedback } from '../services/geminiService';
import { FeedbackSummary, Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';
import { useDebounce } from '../hooks/useDebounce';
import { theme } from '../theme';

interface FeedbackState {
    feedbackText: string;
    summary: FeedbackSummary | null;
}

const FeedbackSummarizer: React.FC = () => {
    const [feedbackText, setFeedbackText] = useState('');
    const [summary, setSummary] = useState<FeedbackSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedFeedback = useDebounce(feedbackText, 500);

    useEffect(() => {
        const savedState = loadStateForTab<FeedbackState>(Tab.Feedback);
        if (savedState) {
            setFeedbackText(savedState.feedbackText || '');
            setSummary(savedState.summary || null);
        }
    }, []);

    useEffect(() => {
        saveStateForTab(Tab.Feedback, { feedbackText, summary });
    }, [debouncedFeedback, summary]);

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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const styles = {
        container: { maxWidth: '768px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' },
        textarea: { width: '100%', minHeight: '150px', padding: '12px', boxSizing: 'border-box' as 'border-box', marginBottom: '16px', borderRadius: '6px', border: '1px solid #d1d5db' },
        button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: theme.primaryColor, color: 'white', borderRadius: '6px', fontSize: '1rem', fontWeight: 500 },
        error: { color: '#dc2626', marginTop: '10px' },
        summarySection: { marginBottom: '20px' },
        summaryTitle: { fontWeight: 600, color: '#111827', fontSize: '1rem', marginBottom: '12px' },
        ul: { paddingLeft: '20px', listStyleType: 'disc', margin: '0', color: '#374151' },
        li: { marginBottom: '8px' }
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
                            {summary.positiveThemes.map((item, index) => <li key={index} style={styles.li}>{item}</li>)}
                        </ul>
                    </div>
                    <div style={styles.summarySection}>
                        <h4 style={styles.summaryTitle}>🤔 Areas for Improvement</h4>
                        <ul style={styles.ul}>
                            {summary.areasForImprovement.map((item, index) => <li key={index} style={styles.li}>{item}</li>)}
                        </ul>
                    </div>
                    <div style={styles.summarySection}>
                        <h4 style={styles.summaryTitle}>💡 Actionable Suggestions</h4>
                        <ul style={styles.ul}>
                            {summary.actionableSuggestions.map((item, index) => <li key={index} style={styles.li}>{item}</li>)}
                        </ul>
                    </div>
                </ResultCard>
            )}
        </div>
    );
};

export default FeedbackSummarizer;