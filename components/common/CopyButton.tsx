import React, { useState, useCallback } from 'react';

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
        padding: '5px 10px',
        fontSize: '0.8rem',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: copied ? '#d4edda' : '#f8f9fa',
        color: copied ? '#155724' : '#343a40',
        marginLeft: '10px',
        float: 'right' as 'right',
    }
  };

  return (
    <button onClick={handleCopy} style={styles.button} disabled={copied}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyButton;
