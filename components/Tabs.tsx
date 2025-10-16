import React from 'react';
import { Tab } from '../types';
import { theme } from '../theme';

interface TabsProps {
  activeTab: Tab;
  onTabClick: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, onTabClick }) => {
  const tabData = [
    { id: Tab.FAQ, label: 'FAQ Generator' },
    { id: Tab.Email, label: 'Email Composer' },
    { id: Tab.Social, label: 'Social Media Planner' },
    { id: Tab.Image, label: 'Image Generator' },
    { id: Tab.Feedback, label: 'Feedback Summarizer' },
  ];
  
  const styles = {
    tabsContainer: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '4px',
    },
    tab: {
        padding: '10px 12px',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: '#374151',
        borderRadius: '6px',
        textAlign: 'left' as 'left',
        transition: 'background-color 0.2s ease, color 0.2s ease',
    },
    activeTab: {
        backgroundColor: '#f3f4f6',
        color: theme.primaryColor,
        fontWeight: 600,
    },
  };

  return (
    <nav style={styles.tabsContainer}>
      {tabData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          style={{
            ...styles.tab,
            ...(activeTab === tab.id ? styles.activeTab : {}),
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;