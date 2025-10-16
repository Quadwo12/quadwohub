import React from 'react';

const Header: React.FC = () => {
    const styles = {
        header: {
            padding: '0 0 24px 0',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '24px',
        },
        title: {
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111827',
        },
        subtitle: {
            margin: '4px 0 0',
            fontSize: '0.875rem',
            color: '#6b7280',
            fontWeight: 400,
        }
    };
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Quadwo's Hub</h1>
      <p style={styles.subtitle}>AI-Powered Business Tools</p>
    </header>
  );
};

export default Header;