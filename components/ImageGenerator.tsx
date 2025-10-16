import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import { saveStateForTab, loadStateForTab } from '../utils/storage';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

interface ImageState {
    prompt: string;
    aspectRatio: AspectRatio;
    style: string;
    imageBase64: string | null;
}

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [style, setStyle] = useState('photorealistic');
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedState = loadStateForTab<ImageState>(Tab.Image);
        if (savedState) {
            setPrompt(savedState.prompt || '');
            setAspectRatio(savedState.aspectRatio || '1:1');
            setStyle(savedState.style || 'photorealistic');
            setImageBase64(savedState.imageBase64 || null);
        }
    }, []);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt for the image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImageBase64(null);
        try {
            const result = await generateImage(prompt, aspectRatio, style);
            setImageBase64(result);
            saveStateForTab(Tab.Image, { prompt, aspectRatio, style, imageBase64: result });
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
        select: { width: '100%', padding: '10px', boxSizing: 'border-box' as 'border-box', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' },
        button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px' },
        error: { color: 'red', marginTop: '10px' },
        image: { maxWidth: '100%', borderRadius: '4px', marginTop: '10px' }
    };

    const aspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    const stylesOptions = ['none', 'photorealistic', 'cinematic', 'anime', 'watercolor', 'digital art', '3d render'];

    return (
        <div style={styles.container}>
            <h2>Image Generator</h2>
            <p>Describe the image you want to create. Be as descriptive as possible!</p>
            
            <label htmlFor="prompt" style={styles.label}>Prompt:</label>
            <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A futuristic cityscape at sunset with flying cars, neon lights, digital art"
                style={{...styles.input, minHeight: '80px'}}
                rows={3}
            />

            <label htmlFor="style" style={styles.label}>Artistic Style:</label>
            <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} style={styles.select}>
                {stylesOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>

            <label htmlFor="aspect-ratio" style={styles.label}>Aspect Ratio:</label>
            <select id="aspect-ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} style={styles.select}>
                {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
            </select>

            <button onClick={handleGenerate} disabled={isLoading} style={styles.button}>
                {isLoading ? 'Generating...' : 'Generate Image'}
            </button>

            {isLoading && <LoadingSpinner />}
            {error && <p style={styles.error}>{error}</p>}
            
            {imageBase64 && (
                <ResultCard title="Generated Image">
                    <img src={`data:image/jpeg;base64,${imageBase64}`} alt={prompt} style={styles.image} />
                </ResultCard>
            )}
        </div>
    );
};

export default ImageGenerator;
