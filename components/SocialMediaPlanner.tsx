import React, { useState, useEffect } from 'react';
import { generateSocialMediaIdeas } from '../services/geminiService';
import { SocialMediaPost, Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';
import CopyButton from './common/CopyButton';
import { useDebounce } from '../hooks/useDebounce';
import { theme } from '../theme';


interface SocialState {
    topic: string;
    posts: SocialMediaPost[];
}

interface SocialMediaPlannerProps {
    onGenerateImage: (prompt: string) => void;
}

const SocialMediaPlanner: React.FC<SocialMediaPlannerProps> = ({ onGenerateImage }) => {
    const [topic, setTopic] = useState('');
    const [posts, setPosts] = useState<SocialMediaPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const debouncedTopic = useDebounce(topic, 500);

    useEffect(() => {
        const savedState = loadStateForTab<SocialState>(Tab.Social);
        if (savedState) {
            setTopic(savedState.topic || '');
            setPosts(savedState.posts || []);
        }
    }, []);

    useEffect(() => {
        saveStateForTab(Tab.Social, { topic, posts });
    }, [debouncedTopic, posts]);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setPosts([]);
        try {
            const result = await generateSocialMediaIdeas(topic);
            setPosts(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const styles = {
        container: { maxWidth: '768px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' },
        input: { width: '100%', padding: '12px', boxSizing: 'border-box' as 'border-box', marginBottom: '16px', borderRadius: '6px', border: '1px solid #d1d5db' },
        button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: theme.primaryColor, color: 'white', borderRadius: '6px', fontSize: '1rem', fontWeight: 500 },
        error: { color: '#dc2626', marginTop: '10px' },
        postCard: { border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', marginBottom: '16px', position: 'relative' as 'relative', backgroundColor: '#ffffff' },
        platform: { fontWeight: 600, color: theme.primaryColor, display: 'inline-block', padding: '4px 8px', backgroundColor: '#e0e7ff', borderRadius: '4px', marginBottom: '12px', fontSize: '0.875rem' },
        postContent: { display: 'flex', flexDirection: 'column' as 'column', gap: '8px' },
        visualSuggestionContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap' as 'wrap',
        },
        generateImageButton: {
            padding: '4px 10px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            border: `1px solid ${theme.primaryColor}`,
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            color: theme.primaryColor,
            fontWeight: 500,
            transition: 'background-color 0.2s ease, color 0.2s ease',
        },
    };

    return (
        <div style={styles.container}>
            <h2>Social Media Planner</h2>
            <p>Enter a topic to brainstorm engaging social media post ideas.</p>

            <label htmlFor="topic" style={styles.label}>Topic:</label>
            <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., The benefits of morning meditation"
                style={styles.input}
            />
            
            <button onClick={handleGenerate} disabled={isLoading} style={styles.button}>
                {isLoading ? 'Generating...' : 'Generate Ideas'}
            </button>

            {isLoading && <LoadingSpinner />}
            {error && <p style={styles.error}>{error}</p>}

            {posts.length > 0 && (
                 <ResultCard title="Generated Social Media Posts">
                    {posts.map((post, index) => {
                         const copyText = `Platform: ${post.platform}\n\nCopy: ${post.copy}\n\nVisual: ${post.visual}`;
                         return (
                            <div key={index} style={styles.postCard}>
                                <div style={{ position: 'absolute', top: '16px', right: '16px' }}><CopyButton textToCopy={copyText} /></div>
                                <p style={styles.platform}>{post.platform}</p>
                                <div style={styles.postContent}>
                                  <p><strong>Copy:</strong> {post.copy}</p>
                                  <div style={styles.visualSuggestionContainer}>
                                    <p style={{ margin: 0 }}><strong>Visual:</strong> {post.visual}</p>
                                    <button
                                        onClick={() => onGenerateImage(post.visual)}
                                        style={styles.generateImageButton}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = theme.primaryColor;
                                            e.currentTarget.style.color = '#ffffff';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = '#ffffff';
                                            e.currentTarget.style.color = theme.primaryColor;
                                        }}
                                    >
                                        ✨ Generate Image
                                    </button>
                                  </div>
                                </div>
                            </div>
                         );
                    })}
                 </ResultCard>
            )}
        </div>
    );
};

export default SocialMediaPlanner;
