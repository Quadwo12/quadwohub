import React from 'react';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, children }) => {
    const styles = {
        card: {
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px',
            marginTop: '24px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
        },
        title: {
            marginTop: 0,
            marginBottom: '16px',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
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