import React from 'react';

const MailIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
);

const LinkIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
    </svg>
);

const LinkedInIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);


const ContactInfo: React.FC = () => {
    const styles = {
        container: {
            borderTop: '1px solid #e5e7eb',
            paddingTop: '16px',
            marginTop: '16px',
        },
        title: {
            margin: '0 0 12px 0',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#6b7280',
            textTransform: 'uppercase' as 'uppercase',
            letterSpacing: '0.05em',
        },
        list: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column' as 'column',
            gap: '10px',
        },
        listItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        link: {
            fontSize: '0.875rem',
            color: '#374151',
            textDecoration: 'none',
            transition: 'color 0.2s ease',
        },
        icon: {
            color: '#9ca3af',
        }
    };

    return (
        <div style={styles.container}>
            <h4 style={styles.title}>Contact</h4>
            <ul style={styles.list}>
                <li style={styles.listItem}>
                    <span style={styles.icon}><MailIcon /></span>
                    <a href="mailto:contact@quadwo.dev" style={styles.link}>contact@quadwo.dev</a>
                </li>
                <li style={styles.listItem}>
                    <span style={styles.icon}><LinkIcon /></span>
                    <a href="https://quadwo.dev" target="_blank" rel="noopener noreferrer" style={styles.link}>quadwo.dev</a>
                </li>
                 <li style={styles.listItem}>
                    <span style={styles.icon}><LinkedInIcon /></span>
                    <a href="https://linkedin.com/in/quadwo" target="_blank" rel="noopener noreferrer" style={styles.link}>LinkedIn</a>
                </li>
            </ul>
        </div>
    );
};

export default ContactInfo;