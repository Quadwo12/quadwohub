import React from 'react';

const Header: React.FC = () => {
    const styles = {
        header: {
            textAlign: 'center' as 'center',
            padding: '20px 0',
            borderBottom: '1px solid #eee',
        },
        title: {
            margin: 0,
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        subtitle: {
            margin: '5px 0 0',
            fontSize: '1.2rem',
            color: '#666',
        }
    };
  return (
    <header style={styles.header}>
      <h1 style={styles.title}>Quadwo's Hub</h1>
      <p style={styles.subtitle}>AI-Powered Content Generation for Your Business</p>
    </header>
  );
};

export default Header;
