import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const LegacyChatbot = () => {
    // State management
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [showVaultSelection, setShowVaultSelection] = useState(false);
    const [selectedVault, setSelectedVault] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [imageLoadingProgress, setImageLoadingProgress] = useState(0);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // APIs
    const TEXT_API = 'https://api-hub-backend.onrender.com/api/v1/auth/testforopenai';
    const IMAGE_API = 'https://image-generation-api-for-anubis.onrender.com/generate-image';
    const GEMINI_API = 'https://your-gemini-api-endpoint.com/generate-description';

    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log("User not authenticated, redirecting to login...");
        }
    }, [user]);

    const imagePromptKeywords = [
        'generate image', 'create image', 'make picture',
        'show me an image', 'draw me', 'visualize', 'generate a picture',
        'image of', 'picture of', 'photo of'
    ];

    // Auto-scroll to bottom of chat
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Generate description using Gemini API
    const generateDescription = async (prompt) => {
        try {
            const response = await axios.post(TEXT_API, {
                mess : `Generate a concise, engaging description for an image based on: "${prompt}"`
            });
            return response.data?.message || `AI-generated image based on: "${prompt}"`;
        } catch (error) {
            console.error("Failed to generate description:", error);
            return `AI-generated image based on: "${prompt}"`;
        }
    };

    // Handle text input submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const shouldGenerateImage = imagePromptKeywords.some(keyword =>
                input.toLowerCase().includes(keyword.toLowerCase())
            );

            if (shouldGenerateImage) {
                let prompt = input;
                imagePromptKeywords.forEach(keyword => {
                    prompt = prompt.replace(new RegExp(keyword, 'gi'), '').trim();
                });
                await generateImage(prompt);
            } else {
                await generateText(input);
            }
        } catch (error) {
            const errorMessage = {
                text: "Apologies, I encountered an issue processing your request. Please try again.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Generate text response
    const generateText = async (prompt) => {
        try {
            const response = await axios.post(TEXT_API, { mess: prompt });

            const botMessage = {
                text: response.data?.message || "I've processed your request. Here's what I can tell you...",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            throw error;
        }
    };

    // Generate image from prompt
    const generateImage = async (prompt) => {
        try {
            const processingMessage = {
                text: `Generating an image based on: "${prompt}"...`,
                sender: 'bot',
                isProcessing: true
            };
            setMessages(prev => [...prev, processingMessage]);

            // Start progress animation
            setImageLoadingProgress(0);
            const progressInterval = setInterval(() => {
                setImageLoadingProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 300);

            const data = {
                prompt: prompt,
                parameters: {
                    width: 1024,
                    height: 1024,
                    seed: Math.floor(Math.random() * 10000),
                    num_inference_steps: 50,
                    guidance_scale: 7.5,
                    high_noise_frac: 0.8,
                    refine: "expert_ensemble_refiner",
                },
            };

            const response = await fetch(IMAGE_API, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(data),
            });

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            if (imageUrl) {
                clearInterval(progressInterval);
                setImageLoadingProgress(100);
                setTimeout(() => {
                    setGeneratedImage(imageUrl);
                    setMessages(prev => prev.filter(msg => !msg.isProcessing));

                    // Generate description using Gemini

                    const description = async () => {
                        const imgDescription = await generateDescription(`Generate a concise description for an image of: "${prompt}"`);
                        setDescription(imgDescription);
                        console.log("Generated description:", imgDescription);
                    }

                    description();


                    const botMessage = {
                        text: "Here's the image I generated:",
                        sender: 'bot',
                        isImageResponse: true
                    };
                    setMessages(prev => [...prev, botMessage]);
                    setImageLoadingProgress(0);
                }, 500);
            } else {
                throw new Error("No image URL in response");
            }
        } catch (error) {
            console.error("Image generation error:", error);
            setMessages(prev => prev.filter(msg => !msg.isProcessing));
            const errorMessage = {
                text: "I couldn't generate that image. Please try a different description.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
            setImageLoadingProgress(0);
        }
    };

    // Handle image posting
    const handlePostImage = async () => {
        if (!selectedVault || !title.trim()) {
            alert('Please select a vault and provide a title');
            return;
        }

        setIsSaving(true);
        try {
            const imageBlob = await fetch(generatedImage).then(res => res.blob());
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('media', imageBlob, 'generated-image.png');
            formData.append('vaultId', selectedVault);

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/memories`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Reset and confirm
            setGeneratedImage(null);
            setSelectedVault('');
            setTitle('');
            setDescription('');
            setShowVaultSelection(false);

            const botMessage = {
                text: `Image successfully saved to your vault!`,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                text: "Failed to save image. Please try again.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col mt-5 h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            {/* <header className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-4 shadow-lg">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-indigo-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Legacy AI</h1>
                            <p className="text-xs opacity-90">Premium AI Assistant</p>
                        </div>
                    </div>
                    <div className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                        {user?.email || "Guest"}
                    </div>
                </div>
            </header> */}

            {/* Chat container */}
            <div
                ref={chatContainerRef}
                className="flex-1  overflow-y-auto p-4 space-y-4 container mx-auto max-w-4xl"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-medium text-gray-800 mb-2">Welcome to Legacy AI</h2>
                        <p className="text-gray-600 max-w-md mb-8">Ask me anything or request an image generation. I'm here to assist with your creative and informational needs.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                            <button
                                onClick={() => setInput('Generate image of cyberpunk city at night with neon lights')}
                                className="p-4 bg-white hover:bg-gray-50 rounded-xl text-left transition-all border border-gray-200 hover:border-indigo-200 hover:shadow-sm"
                            >
                                <div className="font-medium text-gray-800">Cyberpunk city</div>
                                <div className="text-sm text-gray-500 mt-1">Vibrant neon artwork</div>
                            </button>
                            <button
                                onClick={() => setInput('Explain quantum computing in simple terms')}
                                className="p-4 bg-white hover:bg-gray-50 rounded-xl text-left transition-all border border-gray-200 hover:border-indigo-200 hover:shadow-sm"
                            >
                                <div className="font-medium text-gray-800">Quantum computing</div>
                                <div className="text-sm text-gray-500 mt-1">Technical concepts</div>
                            </button>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={`${msg.timestamp}-${index}`}
                            className={`flex overflow-auto ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-3xl rounded-2xl p-4 relative ${msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'}`}
                            >
                                <p className="whitespace-pre-wrap">{msg.text}</p>

                                {/* Image loading animation */}
                                {msg.isProcessing && imageLoadingProgress > 0 && (
                                    <div className="mt-3 w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                                            style={{ width: `${imageLoadingProgress}%` }}
                                        ></div>
                                    </div>
                                )}

                                {/* Image display */}
                                {msg.isImageResponse && generatedImage && (
                                    <div className="mt-3 relative group">
                                        <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                                            <img
                                                src={generatedImage}
                                                alt="AI generated content"
                                                className="w-full h-auto max-h-96 object-contain transition-opacity duration-500"
                                                style={{ opacity: imageLoadingProgress === 100 ? 1 : 0 }}
                                                onLoad={() => setImageLoadingProgress(100)}
                                            />
                                            {imageLoadingProgress < 100 && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                                    <div className="animate-pulse flex space-x-2">
                                                        <div className="w-3 h-3 bg-indigo-300 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                                                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                                            <span>AI-generated image</span>
                                            <button
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = generatedImage;
                                                    link.download = `legacy-ai-${Date.now()}.png`;
                                                    link.click();
                                                }}
                                                className="text-indigo-500 hover:text-indigo-700 text-xs"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Message timestamp */}
                                <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-indigo-100' : 'text-gray-400'}`}>
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {isLoading && !imageLoadingProgress && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-4 max-w-xs shadow-sm border border-gray-100">
                            <div className="flex space-x-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100"></div>
                                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce delay-200"></div>
                                <span className="text-sm ml-2">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Vault selection modal */}
            {showVaultSelection && generatedImage && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Save to Vault</h2>
                            <button
                                onClick={() => setShowVaultSelection(false)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                disabled={isSaving}
                            >
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                                <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                                    <img
                                        src={generatedImage}
                                        alt="Preview"
                                        className="w-full h-32 object-contain"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. 'Sunset Landscape'"
                                    autoFocus
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                                    placeholder="Description of your image"
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Vault*</label>
                                <select
                                    value={selectedVault}
                                    onChange={(e) => setSelectedVault(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    disabled={isSaving}
                                >
                                    <option value="">Choose a vault</option>
                                    {user?.vaults?.map((vault, index) => (
                                        <option key={index} value={vault}>{vault}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowVaultSelection(false)}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePostImage}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                                disabled={!selectedVault || !title.trim() || isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image action bar */}
            {generatedImage && !showVaultSelection && (
                <div className="p-4 border-t border-gray-200 bg-white shadow-sm">
                    <div className="container mx-auto max-w-4xl flex justify-center space-x-4">
                        <button
                            onClick={() => setGeneratedImage(null)}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Close Image
                        </button>
                        <button
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = generatedImage;
                                link.download = `legacy-ai-${Date.now()}.png`;
                                link.click();
                            }}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </button>
                        <button
                            onClick={() => setShowVaultSelection(true)}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Save to Vault
                        </button>
                    </div>
                </div>
            )}

            {/* Input form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 p-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 bg-white"
                            placeholder="Message Legacy AI..."
                            disabled={isLoading}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 p-2 text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                        Legacy AI can make mistakes. Consider verifying important information.
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LegacyChatbot;