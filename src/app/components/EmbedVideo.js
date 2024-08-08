"use client";
import { useState } from 'react';

const EmbedVideo = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [embedUrl, setEmbedUrl] = useState('');
    const [showWarning, setShowWarning] = useState(false);

    const handleInputChange = (e) => {
        setVideoUrl(e.target.value);
    };

    const handleEmbed = (e) => {
        e.preventDefault();
        if (videoUrl) {
            // Convert YouTube URL to embed URL
            const newEmbedUrl = videoUrl.replace(/watch\?v=/, 'embed/');
            setEmbedUrl(newEmbedUrl);
        }
    };

    const handleSave = async () => {
        setShowWarning(true);
    };

    const confirmSave = async () => {
        try {
            const response = await fetch('/api/engagingContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ video: videoUrl }),
            });

            if (response.ok) {
                alert('Video URL saved successfully!');
            } else {
                console.error('Failed to save video URL');
            }
        } catch (error) {
            console.error('Error saving video URL:', error);
        } finally {
            closeWarning();
        }
    };

    const closeWarning = () => {
        setShowWarning(false);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md relative">
            <form onSubmit={handleEmbed} className="flex flex-col">
                <label className="block mb-4">
                    <span className="text-white text-sm">Video URL</span>
                    <input
                        type="text"
                        value={videoUrl}
                        onChange={handleInputChange}
                        placeholder="Enter video URL"
                        className="mt-2 block w-full px-4 py-2 text-sm text-white border border-gray-600 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </label>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md shadow-lg hover:bg-green-600 transition-colors"
                    >
                        Preview Video
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-lg hover:bg-blue-600 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </form>
            {embedUrl && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-white mb-2">Video Preview</h3>
                    <iframe
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-72 rounded-lg shadow-lg"
                    />
                </div>
            )}
            {/* Warning Popup */}
            {showWarning && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                        <h4 className="text-xl font-semibold text-white mb-4">Warning</h4>
                        <p className="text-gray-300 mb-4">Are you sure you want to save this video URL?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={closeWarning}
                                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-lg hover:bg-red-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSave}
                                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-lg hover:bg-green-600 transition-colors"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmbedVideo;
