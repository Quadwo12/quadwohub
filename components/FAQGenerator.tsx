import React, { useState, useEffect } from 'react';
import { generateFAQs } from '../services/geminiService';
import { FAQ, Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';
import CopyButton from './common/CopyButton';

interface FAQState {
    businessDescription: string;
    faqs: FAQ[];
}

const FAQGenerator: React.FC = () => {
  const [businessDescription, setBusinessDescription] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const savedState = loadStateForTab<FAQState>(Tab.FAQ);
      if (savedState) {
          setBusinessDescription(savedState.businessDescription || '');
          setFaqs(savedState.faqs || []);
      }
  }, []);

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
      saveStateForTab(Tab.FAQ, { businessDescription, faqs: result });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: { padding: '20px', border: '1px solid #eee', borderRadius: '8px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    textarea: { width: '100%', minHeight: '100px', padding: '10px', boxSizing: 'border-box' as 'border-box', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px' },
    error: { color: 'red', marginTop: '10px' },
    faqItem: { marginBottom: '15px' },
    question: { fontWeight: 'bold' },
    answer: { marginTop: '5px', color: '#333' }
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
            <CopyButton textToCopy={getCopyText()} />
            {faqs.map((faq, index) => (
                <div key={index} style={styles.faqItem}>
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
