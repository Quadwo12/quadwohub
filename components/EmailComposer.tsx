import React, { useState, useEffect } from 'react';
import { composeMarketingEmail } from '../services/geminiService';
import { MarketingEmail, Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';
import CopyButton from './common/CopyButton';

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

    useEffect(() => {
        const savedState = loadStateForTab<EmailState>(Tab.Email);
        if (savedState) {
            setCustomerSegment(savedState.customerSegment || '');
            setEmailGoal(savedState.emailGoal || '');
            setEmail(savedState.email || null);
        }
    }, []);

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
            saveStateForTab(Tab.Email, { customerSegment, emailGoal, email: result });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const styles = {
        container: { padding: '20px', border: '1px solid #eee', borderRadius: '8px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '10px', boxSizing: 'border-box' as 'border-box', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' },
        button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px' },
        error: { color: 'red', marginTop: '10px' },
        pre: { whiteSpace: 'pre-wrap' as 'pre-wrap', wordWrap: 'break-word' as 'break-word', background: '#f8f9fa', padding: '15px', borderRadius: '4px' }
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
                    <CopyButton textToCopy={getCopyText()} />
                    <pre style={styles.pre}>{email.body}</pre>
                </ResultCard>
            )}
        </div>
    );
};

export default EmailComposer;
