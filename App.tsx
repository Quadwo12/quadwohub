import React, { useState } from 'react';
import { Tab } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import FAQGenerator from './components/FAQGenerator';
import EmailComposer from './components/EmailComposer';
import SocialMediaPlanner from './components/SocialMediaPlanner';
import FeedbackSummarizer from './components/FeedbackSummarizer';
import ImageGenerator from './components/ImageGenerator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.FAQ);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.FAQ:
        return <FAQGenerator />;
      case Tab.Email:
        return <EmailComposer />;
      case Tab.Social:
        return <SocialMediaPlanner />;
      case Tab.Feedback:
        return <FeedbackSummarizer />;
      case Tab.Image:
        return <ImageGenerator />;
      default:
        return <FAQGenerator />;
    }
  };

  const styles = {
    appContainer: {
      display: 'flex',
      minHeight: '100vh',
    },
    sidebar: {
      width: '240px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column' as 'column',
    },
    mainContent: {
      flex: 1,
      padding: '24px 48px',
      backgroundColor: '#f9fafb',
    },
  };

  return (
    <div style={styles.appContainer}>
      <aside style={styles.sidebar}>
        <Header />
        <Tabs activeTab={activeTab} onTabClick={setActiveTab} />
      </aside>
      <main style={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;