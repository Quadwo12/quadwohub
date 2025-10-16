import React from 'react';
import { Tab } from '../types';

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
        justifyContent: 'center' as 'center',
        flexWrap: 'wrap' as 'wrap',
        margin: '20px 0',
        borderBottom: '1px solid #ddd',
    },
    tab: {
        padding: '10px 20px',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        fontSize: '1rem',
        fontWeight: 500,
        color: '#555',
        borderBottom: '3px solid transparent',
    },
    activeTab: {
        color: '#007bff',
        borderBottom: '3px solid #007bff',
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
