import React, { useState } from 'react';
import { Tab } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import FAQGenerator from './components/FAQGenerator';
import EmailComposer from './components/EmailComposer';
import SocialMediaPlanner from './components/SocialMediaPlanner';
import FeedbackSummarizer from './components/FeedbackSummarizer';
import ImageGenerator from './components/ImageGenerator';
import ContactInfo from './components/ContactInfo';
import { saveStateForTab, loadStateForTab } from './utils/storage';

// FIX: Define ImageState type to resolve spread operator error.
// The state shape for the Image tab is needed here, but it's defined locally in ImageGenerator.tsx.
// To avoid a larger refactor, we define the type here to ensure `loadStateForTab` returns a known object shape.
type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
interface ImageState {
    prompt: string;
    aspectRatio: AspectRatio;
    style: string;
    imageBase64: string | null;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.FAQ);

  const handleGenerateImageFromSuggestion = (prompt: string) => {
    // When generating from a suggestion, we use the suggestion as the prompt,
    // clear any previous image, but preserve other settings like aspect ratio and style.
    const existingImageState = loadStateForTab<ImageState>(Tab.Image) || {};
    saveStateForTab(Tab.Image, {
      ...existingImageState,
      prompt: prompt,
      imageBase64: null,
    });
    setActiveTab(Tab.Image);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.FAQ:
        return <FAQGenerator />;
      case Tab.Email:
        return <EmailComposer />;
      case Tab.Social:
        return <SocialMediaPlanner onGenerateImage={handleGenerateImageFromSuggestion} />;
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
    sidebarNav: {
      flexGrow: 1,
    }
  };

  return (
    <div style={styles.appContainer}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarNav}>
          <Header />
          <Tabs activeTab={activeTab} onTabClick={setActiveTab} />
        </div>
        <ContactInfo />
      </aside>
      <main style={styles.mainContent}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
