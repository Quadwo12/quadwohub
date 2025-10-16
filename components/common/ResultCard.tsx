import React from 'react';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, children }) => {
    const styles = {
        card: {
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
        title: {
            marginTop: 0,
            marginBottom: '15px',
            fontSize: '1.25rem',
            color: '#333',
        }
    };
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default ResultCard;
