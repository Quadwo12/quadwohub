import React, { useState, useEffect } from 'react';
import { composeMarketingEmail } from '../services/geminiService';
import { MarketingEmail, Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';
import CopyButton from './common/CopyButton';
import { useDebounce } from '../hooks/useDebounce';
import { theme } from '../theme';

interface EmailState {
    customerSegment: string;
    emailGoal: string;
    email: MarketingEmail | null;
}

const EmailComposer: React.FC = () => {
    const [customerSegment, setCustomerSegment] = useState('');
    const [emailGoal, setEmailGoal] = useState('');
    const [email, setEmail] = useState<MarketingEmail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedSegment = useDebounce(customerSegment, 500);
    const debouncedGoal = useDebounce(emailGoal, 500);

    useEffect(() => {
        const savedState = loadStateForTab<EmailState>(Tab.Email);
        if (savedState) {
            setCustomerSegment(savedState.customerSegment || '');
            setEmailGoal(savedState.emailGoal || '');
            setEmail(savedState.email || null);
        }
    }, []);

    useEffect(() => {
        saveStateForTab(Tab.Email, { customerSegment, emailGoal, email });
    }, [debouncedSegment, debouncedGoal, email]);

    const handleGenerate = async () => {
        if (!customerSegment.trim() || !emailGoal.trim()) {
            setError('Please fill in both customer segment and email goal.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEmail(null);
        try {
            const result = await composeMarketingEmail(customerSegment, emailGoal);
            setEmail(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const styles = {
        container: { maxWidth: '768px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' },
        input: { width: '100%', padding: '12px', boxSizing: 'border-box' as 'border-box', marginBottom: '16px', borderRadius: '6px', border: '1px solid #d1d5db' },
        button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: theme.primaryColor, color: 'white', borderRadius: '6px', fontSize: '1rem', fontWeight: 500 },
        error: { color: '#dc2626', marginTop: '10px' },
        pre: { whiteSpace: 'pre-wrap' as 'pre-wrap', wordWrap: 'break-word' as 'break-word', background: '#f9fafb', padding: '16px', borderRadius: '6px', border: '1px solid #e5e7eb', lineHeight: '1.6' }
    };
    
    const getCopyText = () => `Subject: ${email?.subject}\n\n${email?.body}`;

    return (
        <div style={styles.container}>
            <h2>Email Composer</h2>
            <p>Describe your target audience and the goal of the email to generate a marketing email.</p>
            
            <label htmlFor="customer-segment" style={styles.label}>Customer Segment:</label>
            <input
                id="customer-segment"
                type="text"
                value={customerSegment}
                onChange={(e) => setCustomerSegment(e.target.value)}
                placeholder="e.g., New subscribers who haven't made a purchase"
                style={styles.input}
            />
            
            <label htmlFor="email-goal" style={styles.label}>Email Goal:</label>
            <input
                id="email-goal"
                type="text"
                value={emailGoal}
                onChange={(e) => setEmailGoal(e.target.value)}
                placeholder="e.g., Announce a 20% off flash sale for the weekend"
                style={styles.input}
            />

            <button onClick={handleGenerate} disabled={isLoading} style={styles.button}>
                {isLoading ? 'Composing...' : 'Compose Email'}
            </button>

            {isLoading && <LoadingSpinner />}
            {error && <p style={styles.error}>{error}</p>}
            
            {email && (
                <ResultCard title={`Subject: ${email.subject}`}>
                    <div style={{ float: 'right' }}><CopyButton textToCopy={getCopyText()} /></div>
                    <pre style={styles.pre}>{email.body}</pre>
                </ResultCard>
            )}
        </div>
    );
};

export default EmailComposer;