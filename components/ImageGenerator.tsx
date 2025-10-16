import React, { useState, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { Tab } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import { saveStateForTab, loadStateForTab } from '../utils/storage';
import { useDebounce } from '../hooks/useDebounce';
import { theme } from '../theme';

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

    const debouncedPrompt = useDebounce(prompt, 500);

    useEffect(() => {
        const savedState = loadStateForTab<ImageState>(Tab.Image);
        if (savedState) {
            setPrompt(savedState.prompt || '');
            setAspectRatio(savedState.aspectRatio || '1:1');
            setStyle(savedState.style || 'photorealistic');
            setImageBase64(savedState.imageBase64 || null);
        }
    }, []);

    useEffect(() => {
        saveStateForTab(Tab.Image, { prompt, aspectRatio, style, imageBase64 });
    }, [debouncedPrompt, aspectRatio, style, imageBase64]);

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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!imageBase64) return;
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${imageBase64}`;
        const fileName = prompt.trim().toLowerCase().replace(/\s+/g, '_').slice(0, 50) || 'generated_image';
        link.download = `${fileName}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const styles = {
        container: { maxWidth: '768px' },
        formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: 500, color: '#374151' },
        input: { width: '100%', padding: '12px', boxSizing: 'border-box' as 'border-box', marginBottom: '16px', borderRadius: '6px', border: '1px solid #d1d5db' },
        select: { width: '100%', padding: '12px', boxSizing: 'border-box' as 'border-box', borderRadius: '6px', border: '1px solid #d1d5db', appearance: 'none' as 'none', background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>') no-repeat right 12px center`, backgroundSize: '16px' },
        button: { padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: theme.primaryColor, color: 'white', borderRadius: '6px', fontSize: '1rem', fontWeight: 500 },
        error: { color: '#dc2626', marginTop: '10px' },
        imagePlaceholder: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f3f4f6',
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            marginTop: '24px',
            color: '#6b7280',
            width: '100%',
        },
        image: { maxWidth: '100%', borderRadius: '8px', display: 'block' },
        resultContainer: { marginTop: '24px' },
        downloadButton: { marginTop: '16px', padding: '10px 20px', cursor: 'pointer', border: 'none', backgroundColor: '#10b981', color: 'white', borderRadius: '6px', fontSize: '1rem', fontWeight: 500, width: '100%' },
    };

    const aspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    const stylesOptions = ['none', 'photorealistic', 'vibrant', 'dramatic', 'vintage', 'minimalist', 'cinematic', 'anime', 'watercolor', 'digital art', '3d render'];

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
                style={{...styles.input, minHeight: '80px', marginBottom: '16px'}}
                rows={3}
            />

            <div style={styles.formGrid}>
                <div>
                    <label htmlFor="style" style={styles.label}>Artistic Style:</label>
                    <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} style={styles.select}>
                        {stylesOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="aspect-ratio" style={styles.label}>Aspect Ratio:</label>
                    <select id="aspect-ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} style={styles.select}>
                        {aspectRatios.map(ar => <option key={ar} value={ar}>{ar}</option>)}
                    </select>
                </div>
            </div>

            <button onClick={handleGenerate} disabled={isLoading} style={styles.button}>
                {isLoading ? 'Generating...' : 'Generate Image'}
            </button>

            {error && <p style={styles.error}>{error}</p>}
            
            <div style={styles.resultContainer}>
                <div style={{ ...styles.imagePlaceholder, aspectRatio: aspectRatio.replace(':', ' / ') }}>
                    {isLoading && <LoadingSpinner />}
                    {!isLoading && !imageBase64 && <span>Your generated image will appear here</span>}
                    {imageBase64 && <img src={`data:image/jpeg;base64,${imageBase64}`} alt={prompt} style={styles.image} />}
                </div>

                {imageBase64 && !isLoading && (
                    <button onClick={handleDownload} style={styles.downloadButton}>Download Image</button>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;