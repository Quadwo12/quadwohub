import React, { useState, useEffect } from 'react';
import { composeMarketingEmail } from '../services/geminiService';
import { MarketingEmail, Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';
import CopyButton from './common/CopyButton';
import { useDebounce } from '../hooks/useDebounce';
import { theme } from '../theme';

const emailTemplates = [
  { id: 'custom', name: 'Custom Email', segment: '', goal: '' },
  { id: 'welcome', name: 'Welcome Email', segment: 'New subscribers', goal: 'A warm welcome email introducing the brand and offering a small first-purchase discount.' },
  { id: 'launch', name: 'Product Launch', segment: 'Existing customers and subscribers', goal: 'An exciting announcement for a new product, highlighting its key features and a special launch day offer.' },
  { id: 'holiday', name: 'Holiday Sale', segment: 'All customers', goal: 'A festive email promoting a holiday sale with specific discounts and a sense of urgency.' },
  { id: 're-engagement', name: 'Re-engagement', segment: 'Inactive customers who haven\'t purchased in 3 months', goal: 'A "we miss you" campaign with an exclusive offer to entice them back.' },
];


interface EmailState {
    customerSegment: string;
    emailGoal: string;
    email: MarketingEmail | null;
    selectedTemplate: string;
}

const EmailComposer: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('custom');
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
            setSelectedTemplate(savedState.selectedTemplate || 'custom');
            setCustomerSegment(savedState.customerSegment || '');
            setEmailGoal(savedState.emailGoal || '');
            setEmail(savedState.email || null);
        }
    }, []);

    useEffect(() => {
        saveStateForTab(Tab.Email, { customerSegment, emailGoal, email, selectedTemplate });
    }, [debouncedSegment, debouncedGoal, email, selectedTemplate]);

    const handleTemplateChange = (templateId: string) => {
        const template = emailTemplates.find(t => t.id === templateId);
        if (template) {
            setSelectedTemplate(template.id);
            setCustomerSegment(template.segment);
            setEmailGoal(template.goal);
        }
    };

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
        textarea: { width: '100%', minHeight: '100px', padding: '12px', boxSizing: 'border-box' as 'border-box', marginBottom: '16px', borderRadius: '6px', border: '1px solid #d1d5db' },
        select: { width: '100%', padding: '12px', boxSizing: 'border-box' as 'border-box', borderRadius: '6px', border: '1px solid #d1d5db', appearance: 'none' as 'none', background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>') no-repeat right 12px center`, backgroundSize: '16px', marginBottom: '16px' },
        button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: theme.primaryColor, color: 'white', borderRadius: '6px', fontSize: '1rem', fontWeight: 500 },
        error: { color: '#dc2626', marginTop: '10px' },
        pre: { whiteSpace: 'pre-wrap' as 'pre-wrap', wordWrap: 'break-word' as 'break-word', background: '#f9fafb', padding: '16px', borderRadius: '6px', border: '1px solid #e5e7eb', lineHeight: '1.6' }
    };
    
    const getCopyText = () => `Subject: ${email?.subject}\n\n${email?.body}`;

    return (
        <div style={styles.container}>
            <h2>Email Composer</h2>
            <p>Select a template or describe your audience and goal to generate a marketing email.</p>
            
            <label htmlFor="template-select" style={styles.label}>Email Template:</label>
            <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                style={styles.select}
            >
                {emailTemplates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                ))}
            </select>

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
            <textarea
                id="email-goal"
                value={emailGoal}
                onChange={(e) => setEmailGoal(e.target.value)}
                placeholder="e.g., Announce a 20% off flash sale for the weekend"
                style={styles.textarea}
                rows={3}
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