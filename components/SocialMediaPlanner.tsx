import React, { useState, useEffect } from 'react';
import { generateSocialMediaIdeas } from '../services/geminiService';
import { SocialMediaPost, Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';
import CopyButton from './common/CopyButton';

interface SocialState {
    topic: string;
    posts: SocialMediaPost[];
}

const SocialMediaPlanner: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [posts, setPosts] = useState<SocialMediaPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedState = loadStateForTab<SocialState>(Tab.Social);
        if (savedState) {
            setTopic(savedState.topic || '');
            setPosts(savedState.posts || []);
        }
    }, []);

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
            saveStateForTab(Tab.Social, { topic, posts: result });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const styles = {
        container: { padding: '20px', border: '1px solid #eee', borderRadius: '8px' },
        label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
        input: { width: '100%', padding: '10px', boxSizing: 'border-box' as 'border-box', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' },
        button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px' },
        error: { color: 'red', marginTop: '10px' },
        postCard: { border: '1px solid #ddd', padding: '15px', borderRadius: '4px', marginBottom: '15px', position: 'relative' as 'relative' },
        platform: { fontWeight: 'bold', color: '#007bff' }
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
                                <CopyButton textToCopy={copyText} />
                                <p><strong style={styles.platform}>{post.platform}</strong></p>
                                <p><strong>Copy:</strong> {post.copy}</p>
                                <p><strong>Visual:</strong> {post.visual}</p>
                            </div>
                         );
                    })}
                 </ResultCard>
            )}
        </div>
    );
};

export default SocialMediaPlanner;
