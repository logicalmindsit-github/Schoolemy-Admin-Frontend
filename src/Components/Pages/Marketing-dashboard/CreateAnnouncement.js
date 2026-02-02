

import React, { useState, useEffect } from 'react';
import axios from '../../../Utils/api';

// --- WORLD-CLASS MODERN STYLES ---
const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
    padding: '3rem 1.5rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const formContainerStyle = {
    maxWidth: '1000px',
    margin: '0 auto 2.5rem auto',
    padding: '2.5rem',
    border: 'none',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
};

const headerSection = {
    textAlign: 'center',
    marginBottom: '2.5rem',
};

const mainTitle = {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: '0.5rem',
    letterSpacing: '-0.5px',
};

const subtitle = {
    fontSize: '1rem',
    color: '#64748b',
    fontWeight: '500',
};

const inputStyle = {
    width: '100%',
    padding: '0.875rem 1.125rem',
    marginBottom: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    boxSizing: 'border-box',
    fontSize: '1rem',
    backgroundColor: '#f8fafc',
    transition: 'all 0.3s ease',
    outline: 'none',
};

const inputFocusStyle = {
    border: '2px solid #0ea5e9',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.1)',
};

const textareaStyle = {
    ...inputStyle,
    minHeight: '150px',
    resize: 'vertical',
    fontFamily: 'inherit',
};

const buttonStyle = {
    width: '100%',
    padding: '1rem 1.5rem',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
};

const buttonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(14, 165, 233, 0.6)',
};

const messageStyle = {
    marginTop: '1.5rem',
    fontWeight: '600',
    textAlign: 'center',
    padding: '1rem',
    borderRadius: '12px',
};

const successStyle = {
    color: '#059669',
    backgroundColor: '#d1fae5',
    border: '2px solid #34d399',
};

const errorStyle = {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    border: '2px solid #f87171',
};

const historyContainerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
};

const previewBoxStyle = {
    width: '100%',
    minHeight: 120,
    border: '2px dashed #cbd5e1',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    marginBottom: '1rem',
    padding: '1rem',
    transition: 'all 0.3s ease',
};

const fileLabelStyle = {
    color: '#1e293b',
    fontSize: '0.95rem',
    marginBottom: '0.75rem',
    fontWeight: '600',
    display: 'block',
};

const smallImageStyle = {
    maxWidth: '100%',
    maxHeight: 300,
    borderRadius: '12px',
    objectFit: 'cover',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    border: '3px solid #ffffff',
};

const historyListStyle = {
    maxHeight: '700px',
    overflowY: 'auto',
    padding: '1.5rem',
    border: 'none',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
};

const announcementCardStyle = {
    backgroundColor: '#ffffff',
    border: '2px solid #e2e8f0',
    borderLeft: '5px solid #0ea5e9',
    padding: '1.5rem',
    borderRadius: '16px',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
};

const cardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
};

const cardTitleStyle = {
    margin: '0 0 0.75rem 0',
    fontSize: '1.4rem',
    color: '#1e293b',
    fontWeight: '700',
};

const cardContentStyle = {
    margin: '0 0 1rem 0',
    color: '#4a5568',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6',
};

const cardDateStyle = {
    fontSize: '0.85rem',
    color: '#94a3b8',
    textAlign: 'right',
    fontWeight: '500',
};

const cardButtonStyle = {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '2px solid #e2e8f0',
    fontSize: '0.9rem',
    color: '#475569',
};

const sectionDivider = {
    margin: '1.5rem 0',
    border: 'none',
    borderTop: '2px solid #e2e8f0',
};

const labelStyle = {
    color: '#1e293b',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    display: 'block',
};

const historyHeaderStyle = {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: '2rem',
};

const emptyStateStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#94a3b8',
    fontSize: '1.1rem',
    fontWeight: '500',
};


function CreateAnnouncement() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [buttonUrl, setButtonUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pastAnnouncements, setPastAnnouncements] = useState([]);
    const [focusedInput, setFocusedInput] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get('/api/announcements/all');
            const sortedAnnouncements = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPastAnnouncements(sortedAnnouncements);
        } catch (error) {
            console.error('Failed to fetch past announcements:', error);
            setStatusMessage('Could not load past announcements.');
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setStatusMessage('Please select a valid image file.');
            return;
        }
        const maxSize = 3 * 1024 * 1024;
        if (file.size > maxSize) {
            setStatusMessage('Image size should be less than 3MB.');
            return;
        }

        setImageFile(file);
        setStatusMessage('');

        const reader = new FileReader();
        reader.onload = (ev) => setImagePreviewUrl(ev.target.result);
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreviewUrl('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage('Publishing...');

        try {
            const form = new FormData();
            form.append('title', title);
            form.append('content', content);
            form.append('button_text', buttonText);
            form.append('button_url', buttonUrl);
            if (imageFile) form.append('image', imageFile);

            await axios.post('/api/announcements/create', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setStatusMessage('Published successfully!');
            setTitle('');
            setContent('');
            setButtonText('');
            setButtonUrl('');
            setImageFile(null);
            setImagePreviewUrl('');

            await fetchAnnouncements();
            setTimeout(() => setStatusMessage(''), 4000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Could not create announcement.';
            setStatusMessage(errorMessage);
            console.error('Error creating announcement:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <div style={formContainerStyle}>
                <div style={headerSection}>
                    <h2 style={mainTitle}>📢 Global Announcement Hub</h2>
                    <p style={subtitle}>Broadcast important updates to your entire community instantly</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>📝 Announcement Title</label>
                        <input 
                            style={{
                                ...inputStyle,
                                ...(focusedInput === 'title' && inputFocusStyle)
                            }} 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            onFocus={() => setFocusedInput('title')}
                            onBlur={() => setFocusedInput(null)}
                            placeholder="e.g., System Maintenance Scheduled" 
                            required 
                            disabled={isLoading} 
                        />
                    </div>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>✍️ Announcement Content</label>
                        <textarea 
                            style={{
                                ...textareaStyle,
                                ...(focusedInput === 'content' && inputFocusStyle)
                            }} 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            onFocus={() => setFocusedInput('content')}
                            onBlur={() => setFocusedInput(null)}
                            placeholder="Type your announcement details here..." 
                            required 
                            disabled={isLoading} 
                        />
                    </div>
                    
                    <hr style={sectionDivider}/>
                    <p style={{margin: "0 0 1.5rem 0", color: "#64748b", fontWeight: 600, fontSize: '1rem'}}>🔘 Optional Call-to-Action Button</p>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                        <div>
                            <label style={labelStyle}>Button Text</label>
                            <input 
                                style={{
                                    ...inputStyle,
                                    ...(focusedInput === 'buttonText' && inputFocusStyle)
                                }} 
                                type="text" 
                                value={buttonText} 
                                onChange={(e) => setButtonText(e.target.value)} 
                                onFocus={() => setFocusedInput('buttonText')}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="e.g., View Details" 
                                disabled={isLoading} 
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Button URL</label>
                            <input 
                                style={{
                                    ...inputStyle,
                                    ...(focusedInput === 'buttonUrl' && inputFocusStyle)
                                }} 
                                type="url" 
                                value={buttonUrl} 
                                onChange={(e) => setButtonUrl(e.target.value)} 
                                onFocus={() => setFocusedInput('buttonUrl')}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="https://..." 
                                disabled={isLoading} 
                            />
                        </div>
                    </div>

                    <div>
                        <label style={fileLabelStyle}>🖼️ Optional Image (Preview shown below)</label>
                        <div style={previewBoxStyle}>
                            {imagePreviewUrl ? (
                                <div style={{width: '100%', textAlign: 'center'}}>
                                    <img src={imagePreviewUrl} alt="preview" style={smallImageStyle} />
                                    <div style={{marginTop: '1rem'}}>
                                        <button 
                                            type="button" 
                                            onClick={clearImage} 
                                            style={{
                                                background: 'transparent', 
                                                border: '2px solid #ef4444', 
                                                color: '#ef4444', 
                                                cursor: 'pointer',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#ef4444';
                                                e.target.style.color = '#ffffff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = '#ef4444';
                                            }}
                                        >
                                            🗑️ Remove Image
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{color: '#94a3b8', fontSize: '1rem'}}>📷 No image selected. Choose a file to preview.</div>
                            )}
                        </div>
                        <input 
                            style={{
                                marginTop: '0.5rem',
                                padding: '0.75rem',
                                border: '2px dashed #cbd5e1',
                                borderRadius: '8px',
                                width: '100%',
                                boxSizing: 'border-box',
                                backgroundColor: '#f8fafc'
                            }} 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            disabled={isLoading} 
                        />
                    </div>
                    <hr style={sectionDivider}/>
                    
                    <button 
                        type="submit" 
                        style={buttonStyle} 
                        disabled={isLoading}
                        onMouseEnter={(e) => !isLoading && Object.assign(e.target.style, buttonHoverStyle)}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                        }}
                    >
                        {isLoading ? '📤 Publishing...' : '🚀 Publish Announcement'}
                    </button>
                </form>
                
                {statusMessage && (
                    <div style={{ 
                        ...messageStyle, 
                        ...(statusMessage.includes('successfully') ? successStyle : errorStyle)
                    }}>
                        {statusMessage.includes('successfully') ? '✅ ' : '❌ '}{statusMessage}
                    </div>
                )}
            </div>

            <div style={historyContainerStyle}>
                <h3 style={historyHeaderStyle}>📚 Announcement History</h3>
                <div style={historyListStyle}>
                    {pastAnnouncements.length > 0 ? (
                        pastAnnouncements.map((ann) => (
                            <div 
                                key={ann._id} 
                                style={{
                                    ...announcementCardStyle,
                                    ...(hoveredCard === ann._id && cardHoverStyle)
                                }}
                                onMouseEnter={() => setHoveredCard(ann._id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <h4 style={cardTitleStyle}>{ann.title}</h4>
                                <p style={cardContentStyle}>{ann.content}</p>
                                {ann.image_path && (
                                    <div style={{textAlign: 'center', marginTop: '1rem'}}>
                                        <img 
                                            src={ann.image_path.startsWith('/') ? ann.image_path : `/uploads/announcements/${ann.image_path}`} 
                                            alt={ann.title} 
                                            style={smallImageStyle} 
                                        />
                                    </div>
                                )}
                                
                                {ann.button_text && ann.button_url && (
                                    <div style={cardButtonStyle}>
                                        <p style={{margin: '0 0 0.5rem 0', fontWeight: '600'}}>
                                            🔘 <strong>Button:</strong> {ann.button_text}
                                        </p>
                                        <p style={{margin: 0}}>
                                            <strong>URL:</strong> <a 
                                                href={ann.button_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{
                                                    color: '#0ea5e9',
                                                    textDecoration: 'none',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {ann.button_url}
                                            </a>
                                        </p>
                                    </div>
                                )}

                                <p style={cardDateStyle}>
                                    📅 Published: {new Date(ann.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div style={emptyStateStyle}>
                            <p>📭 No announcements found yet. Create your first one!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateAnnouncement;