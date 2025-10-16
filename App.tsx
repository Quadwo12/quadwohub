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
      fontFamily: 'sans-serif',
      maxWidth: '960px',
      margin: '0 auto',
      padding: '20px',
    },
    contentContainer: {
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.appContainer}>
      <Header />
      <Tabs activeTab={activeTab} onTabClick={setActiveTab} />
      <main style={styles.contentContainer}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
