import React, { useState, useEffect } from 'react';
import { generateFAQs } from '../services/geminiService';
import { FAQ, Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';
import CopyButton from './common/CopyButton';
import { useDebounce } from '../hooks/useDebounce';
import { theme } from '../theme';

interface FAQState {
    businessDescription: string;
    faqs: FAQ[];
}

const FAQGenerator: React.FC = () => {
  const [businessDescription, setBusinessDescription] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedDescription = useDebounce(businessDescription, 500);

  useEffect(() => {
      const savedState = loadStateForTab<FAQState>(Tab.FAQ);
      if (savedState) {
          setBusinessDescription(savedState.businessDescription || '');
          setFaqs(savedState.faqs || []);
      }
  }, []);

  useEffect(() => {
      saveStateForTab(Tab.FAQ, { businessDescription, faqs });
  }, [debouncedDescription, faqs]);

  const handleGenerate = async () => {
    if (!businessDescription.trim()) {
      setError('Please enter a business description.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFaqs([]);
    try {
      const result = await generateFAQs(businessDescription);
      setFaqs(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '768px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' },
    textarea: { width: '100%', minHeight: '100px', padding: '12px', boxSizing: 'border-box' as 'border-box', marginBottom: '16px', borderRadius: '6px', border: '1px solid #d1d5db' },
    button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: theme.primaryColor, color: 'white', borderRadius: '6px', fontSize: '1rem', fontWeight: 500 },
    error: { color: '#dc2626', marginTop: '10px' },
    faqItem: { marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' },
    question: { fontWeight: 600, color: '#111827' },
    answer: { marginTop: '8px', color: '#374151', lineHeight: '1.6' },
    resultHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  };

  const getCopyText = () => faqs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');

  return (
    <div style={styles.container}>
      <h2>FAQ Generator</h2>
      <p>Enter a description of your business to generate a list of Frequently Asked Questions.</p>
      
      <label htmlFor="business-description" style={styles.label}>Business Description:</label>
      <textarea
        id="business-description"
        value={businessDescription}
        onChange={(e) => setBusinessDescription(e.target.value)}
        placeholder="e.g., An online store that sells handmade artisanal coffee mugs."
        style={styles.textarea}
        rows={4}
      />

      <button onClick={handleGenerate} disabled={isLoading} style={styles.button}>
        {isLoading ? 'Generating...' : 'Generate FAQs'}
      </button>

      {isLoading && <LoadingSpinner />}
      {error && <p style={styles.error}>{error}</p>}
      
      {faqs.length > 0 && (
        <ResultCard title="Generated FAQs">
            <div style={{ float: 'right' }}><CopyButton textToCopy={getCopyText()} /></div>
            {faqs.map((faq, index) => (
                <div key={index} style={{...styles.faqItem, borderBottom: index === faqs.length - 1 ? 'none': '1px solid #e5e7eb'}}>
                    <p style={styles.question}>{faq.question}</p>
                    <p style={styles.answer}>{faq.answer}</p>
                </div>
            ))}
        </ResultCard>
      )}
    </div>
  );
};

export default FAQGenerator;