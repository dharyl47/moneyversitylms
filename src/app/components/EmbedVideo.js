"use client";
import { useState } from 'react';
import Button from './Button';

const EmbedVideo = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [embedUrl, setEmbedUrl] = useState('');

    const handleInputChange = (e) => {
        setVideoUrl(e.target.value);
    };

    const handleEmbed = () => {
        if (videoUrl) {
            // Convert YouTube URL to embed URL
            const newEmbedUrl = videoUrl.replace(/watch\?v=/, 'embed/');
            setEmbedUrl(newEmbedUrl);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={videoUrl}
                className="mr-4"
                onChange={handleInputChange}
                placeholder="Enter video URL"
                style={{ width: '30%', padding: '10px', marginBottom: '10px' }}
            />
            <Button onClick={handleEmbed} text="Upload Video"></Button >
            {embedUrl && (
                <div style={{ marginTop: '20px' }}>
                    <iframe
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ width: '100%', height: '315px' }}
                    />
                </div>
            )}
        </div>
    );
};

export default EmbedVideo;