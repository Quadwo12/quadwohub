import React from 'react';

const LoadingSpinner: React.FC = () => {
    // Inject keyframes for the spin animation
    const keyframes = `
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    `;

    const styles = {
        spinnerContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
        },
        spinner: {
            border: '4px solid rgba(0, 0, 0, 0.1)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            borderLeftColor: '#007bff',
            animation: 'spin 1s linear infinite',
        },
    };

    return (
        <div style={styles.spinnerContainer}>
            <style>{keyframes}</style>
            <div style={styles.spinner}></div>
        </div>
    );
};

export default LoadingSpinner;
