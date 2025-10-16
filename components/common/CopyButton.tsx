import React, { useState, useCallback } from 'react';
import { theme } from '../../theme';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  }, [textToCopy]);
  
  const styles = {
    button: {
        padding: '6px 12px',
        fontSize: '0.875rem',
        cursor: 'pointer',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        backgroundColor: copied ? '#dcfce7' : '#ffffff',
        color: copied ? '#166534' : '#374151',
        fontWeight: 500,
        transition: 'background-color 0.2s ease',
    }
  };

  return (
    <button onClick={handleCopy} style={styles.button} disabled={copied}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyButton;