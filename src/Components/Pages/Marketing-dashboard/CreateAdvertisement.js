import React, { useState, useEffect } from 'react';
import axios from '../../../Utils/api';

// --- WORLD-CLASS MODERN STYLES ---
const styles = {
    pageWrapper: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
        padding: '3rem 1.5rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        marginBottom: '2.5rem',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    headerSection: {
        textAlign: 'center',
        marginBottom: '2.5rem',
    },
    mainTitle: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: '0.5rem',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#64748b',
        fontWeight: '500',
        lineHeight: '1.6',
    },
    formGroup: {
        marginBottom: '1.75rem',
    },
    label: {
        display: 'block',
        fontWeight: '600',
        marginBottom: '0.75rem',
        color: '#1e293b',
        fontSize: '0.95rem',
        letterSpacing: '0.3px',
    },
    input: {
        width: '100%',
        padding: '0.875rem 1.125rem',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        fontSize: '1rem',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        backgroundColor: '#f8fafc',
        outline: 'none',
    },
    inputFocus: {
        border: '2px solid #0ea5e9',
        backgroundColor: '#ffffff',
        boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.1)',
    },
    inputFile: {
        width: '100%',
        padding: '1rem',
        border: '2px dashed #cbd5e1',
        borderRadius: '12px',
        fontSize: '1rem',
        boxSizing: 'border-box',
        backgroundColor: '#f8fafc',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    imagePreview: {
        marginBottom: '1.75rem',
        textAlign: 'center',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
    },
    previewLabel: {
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#64748b',
        marginBottom: '1rem',
        display: 'block',
    },
    previewImage: {
        maxWidth: '100%',
        maxHeight: '300px',
        border: '3px solid #ffffff',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        objectFit: 'cover',
    },
    button: {
        width: '100%',
        padding: '1rem 1.5rem',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
    },
    buttonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(14, 165, 233, 0.6)',
    },
    successMessage: {
        color: '#059669',
        textAlign: 'center',
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#d1fae5',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '1rem',
        border: '2px solid #34d399',
    },
    errorMessage: {
        color: '#dc2626',
        textAlign: 'center',
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#fee2e2',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '1rem',
        border: '2px solid #f87171',
    },
    historyHeader: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#1e293b',
        borderBottom: '3px solid #e2e8f0',
        paddingBottom: '1rem',
        marginBottom: '2rem',
        textAlign: 'center',
    },
    historyItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1.5rem',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
    },
    historyItemHover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        borderColor: '#cbd5e1',
    },
    activeHistoryItem: {
        borderColor: '#0ea5e9',
        backgroundColor: '#e0f2fe',
        boxShadow: '0 8px 24px rgba(14, 165, 233, 0.2)',
    },
    historyImage: {
        width: '140px',
        height: '100px',
        borderRadius: '12px',
        objectFit: 'cover',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    adInfo: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    adInfoTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1e293b',
    },
    adInfoLink: {
        margin: '0',
        fontSize: '0.9rem',
        color: '#64748b',
        wordBreak: 'break-all',
    },
    adInfoLinkAnchor: {
        color: '#0ea5e9',
        textDecoration: 'none',
        fontWeight: '600',
    },
    adInfoDate: {
        fontSize: '0.85rem',
        color: '#94a3b8',
    },
    activeBadge: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '0.4rem 1rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '700',
        width: 'fit-content',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
        letterSpacing: '0.5px',
    },
    emptyState: {
        textAlign: 'center',
        padding: '3rem',
        color: '#94a3b8',
        fontSize: '1.1rem',
        fontWeight: '500',
    }
};
// --- END WORLD-CLASS STYLES ---

const CreateAdvertisement = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [targetUrl, setTargetUrl] = useState('');
    const [allAds, setAllAds] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!file || !targetUrl) {
            setError('Please provide an image and a target URL.');
            return;
        }

        const formData = new FormData();
        formData.append('adImage', file);
        formData.append('title', title);
        formData.append('targetUrl', targetUrl);

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/advertisements/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setMessage('Advertisement activated successfully!');
            
            setFile(null);
            setTitle('');
            setTargetUrl('');
            setPreview(null);
            e.target.reset();

            fetchAllAds();

        } catch (err) {
            setError('Upload failed. Please check the console and try again.');
            console.error(err);
        }
    };
    
    const fetchAllAds = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/advertisements/all', {
                 headers: { 'Authorization': `Bearer ${token}` }
            });
            setAllAds(res.data);
        } catch (error) {
            console.error("Could not fetch advertisements history", error);
        }
    }

    useEffect(() => {
        fetchAllAds();
    }, []);

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.headerSection}>
                        <h2 style={styles.mainTitle}>✨ Advertisement Manager</h2>
                        <p style={styles.subtitle}>Create stunning advertisements that captivate your audience.<br/>Each new upload automatically becomes the active ad.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div style={styles.formGroup}>
                            <label htmlFor="title" style={styles.label}>📝 Advertisement Title</label>
                            <input
                                type="text"
                                id="title"
                                style={{
                                    ...styles.input,
                                    ...(focusedInput === 'title' && styles.inputFocus)
                                }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onFocus={() => setFocusedInput('title')}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="e.g., Summer Sale - 50% Off All Courses!"
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="targetUrl" style={styles.label}>🔗 Target URL (Destination Link)</label>
                            <input
                                type="url"
                                id="targetUrl"
                                style={{
                                    ...styles.input,
                                    ...(focusedInput === 'targetUrl' && styles.inputFocus)
                                }}
                                value={targetUrl}
                                onChange={(e) => setTargetUrl(e.target.value)}
                                onFocus={() => setFocusedInput('targetUrl')}
                                onBlur={() => setFocusedInput(null)}
                                placeholder="https://www.your-website.com/sale"
                                required
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label htmlFor="adImage" style={styles.label}>🖼️ Advertisement Image</label>
                            <input
                                type="file"
                                id="adImage"
                                style={styles.inputFile}
                                accept="image/png, image/jpeg, image/gif, image/webp"
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        {preview && (
                            <div style={styles.imagePreview}>
                                <span style={styles.previewLabel}>Preview Your Advertisement</span>
                                <img src={preview} alt="Advertisement Preview" style={styles.previewImage} />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            style={styles.button}
                            onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            🚀 Upload & Activate
                        </button>
                    </form>
                    
                    {message && <div style={styles.successMessage}>✅ {message}</div>}
                    {error && <div style={styles.errorMessage}>❌ {error}</div>}
                </div>

                <div style={styles.card}>
                    <h3 style={styles.historyHeader}>📚 Advertisement History</h3>
                    <div>
                        {allAds.length > 0 ? allAds.map(ad => (
                            <div 
                                key={ad._id} 
                                style={{
                                    ...styles.historyItem,
                                    ...(ad.is_active && styles.activeHistoryItem),
                                    ...(hoveredItem === ad._id && !ad.is_active && styles.historyItemHover)
                                }}
                                onMouseEnter={() => setHoveredItem(ad._id)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <img 
                                    src={`${axios.defaults.baseURL}${ad.image_path}`} 
                                    alt={ad.title || 'Advertisement'} 
                                    style={styles.historyImage} 
                                />
                                <div style={styles.adInfo}>
                                    <strong style={styles.adInfoTitle}>{ad.title || 'Untitled Advertisement'}</strong>
                                    <p style={styles.adInfoLink}>
                                        🔗 Link: <a href={ad.target_url} target="_blank" rel="noopener noreferrer" style={styles.adInfoLinkAnchor}>{ad.target_url}</a>
                                    </p>
                                    <small style={styles.adInfoDate}>📅 Uploaded: {new Date(ad.createdAt).toLocaleString()}</small>
                                    {ad.is_active && <span style={styles.activeBadge}>⚡ CURRENTLY ACTIVE</span>}
                                </div>
                            </div>
                        )) : (
                            <div style={styles.emptyState}>
                                <p>📭 No advertisements found yet. Create your first one!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAdvertisement;