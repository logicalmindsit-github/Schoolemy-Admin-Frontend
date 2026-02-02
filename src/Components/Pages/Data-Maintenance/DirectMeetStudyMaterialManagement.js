import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../../Utils/api';

// Style Constants
const colors = {
  primary: '#4F46E5', primaryDark: '#4338CA', textPrimary: '#1F2937',
  textSecondary: '#4B5563', textLight: '#6B7280', borderLight: '#E5E7EB',
  borderDefault: '#D1D5DB', bgRoot: 'linear-gradient(to bottom right, #F9FAFB, #F3F4F6)',
  bgLight: '#F9FAFB', bgLighter: '#F3F4F6', white: '#FFFFFF',
  success: '#10B981', error: '#EF4444', deleteColor: '#DC2626', deleteDark: '#B91C1C',
  fileTypeColors: {
    pdf: '#EF4444', doc: '#3B82F6', ppt: '#F59E0B', xls: '#10B981',
    image: '#A855F7', video: '#EC4899', audio: '#6366F1', archive: '#78716C',
    default: '#6B7280',
  }
};

const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  modal: '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)',
};

const typography = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};


// --- Reusable Form Fields Components ---
const StudyMaterialFormFields = ({ formData, handleFormChange, handleFileChange, selectedFile, errors, isEdit = false }) => {
  const formStyles = {
    formGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' },
    formLabel: { display: 'block', fontSize: '14px', fontWeight: '500', color: colors.textSecondary, marginBottom: '4px' },
    formInput: { width: '100%', padding: '10px 16px', borderRadius: '8px', border: `1px solid ${colors.borderDefault}`, fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s', outline: 'none' },
    formTextarea: { minHeight: '100px', resize: 'vertical' },
    formInputFocus: { borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` },
    formInputError: { borderColor: colors.error },
    formErrorText: { marginTop: '4px', fontSize: '12px', color: colors.error },
    fileInputLabel: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '120px', border: `2px dashed ${colors.borderDefault}`, borderRadius: '8px', cursor: 'pointer', backgroundColor: colors.bgLight, transition: 'border-color 0.2s', padding: '16px' },
    fileInputLabelHover: { borderColor: colors.primary },
    fileInputIcon: { width: '32px', height: '32px', marginBottom: '8px', color: colors.textLight },
    fileInputText: { fontSize: '14px', color: colors.textLight, textAlign: 'center' },
  };
  const [isFileInputHovered, setIsFileInputHovered] = useState(false);
  const handleFocus = (e) => { e.target.style.borderColor = colors.primary; e.target.style.boxShadow = formStyles.formInputFocus.boxShadow; }
  const handleBlur = (e) => {
    e.target.style.boxShadow = 'none';
    if (errors[e.target.name]) e.target.style.borderColor = colors.error;
    else e.target.style.borderColor = colors.borderDefault;
  };

  return (
    <div style={formStyles.formGrid}>
      <div>
        <label style={formStyles.formLabel}>Title *</label>
        <input type="text" name="title" value={formData.title} onChange={handleFormChange} onFocus={handleFocus} onBlur={handleBlur} style={{ ...formStyles.formInput, ...(errors.title && formStyles.formInputError) }} placeholder="e.g., Chapter 1 Notes" />
        {errors.title && <p style={formStyles.formErrorText}>{errors.title}</p>}
      </div>
      <div>
        <label style={formStyles.formLabel}>Description *</label>
        <textarea name="description" value={formData.description} onChange={handleFormChange} onFocus={handleFocus} onBlur={handleBlur} style={{ ...formStyles.formInput, ...formStyles.formTextarea, ...(errors.description && formStyles.formInputError) }} placeholder="Brief description of the material..." />
        {errors.description && <p style={formStyles.formErrorText}>{errors.description}</p>}
      </div>
      {!isEdit && ( // File input only for create mode
        <div>
          <label style={formStyles.formLabel}>File *</label>
          <label style={{ ...formStyles.fileInputLabel, ...(isFileInputHovered && formStyles.fileInputLabelHover) }} onMouseEnter={() => setIsFileInputHovered(true)} onMouseLeave={() => setIsFileInputHovered(false)}>
            <svg style={formStyles.fileInputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p style={formStyles.fileInputText}>
              {selectedFile ? selectedFile.name : 'Click or drag file to upload'}
            </p>
            <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
          {errors.file && <p style={formStyles.formErrorText}>{errors.file}</p>}
        </div>
      )}
      {isEdit && formData.fileUrl && (
         <div>
            <label style={formStyles.formLabel}>Current File URL</label>
            <input type="text" name="fileUrl" value={formData.fileUrl} readOnly style={{ ...formStyles.formInput, backgroundColor: colors.bgLighter, cursor: 'not-allowed' }}/>
            <p style={{fontSize: '12px', color: colors.textLight, marginTop: '4px'}}>To change the file, please delete this material and upload a new one.</p>
         </div>
      )}
    </div>
  );
};

const DirectMeetStudyMaterialManagement = () => {
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', fileUrl: '' }); // fileUrl for edit
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Hover states
  const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);
  const [isModalActionButtonHovered, setIsModalActionButtonHovered] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  
  // No pagination in backend, so no pagination state here

  const fetchStudyMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/direct-meet-study-material/get');
      setStudyMaterials(response.data.studyMaterials);
    } catch (error) {
      console.error('Failed to fetch study materials:', error);
      setSuccessMessage(error.response?.data?.message || 'Error fetching study materials.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudyMaterials();
  }, [fetchStudyMaterials]);

  const resetForm = () => {
    setFormData({ title: '', description: '', fileUrl: '' });
    setSelectedFile(null);
    setErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (errors.file) setErrors(prev => ({...prev, file: null})); // Clear file error on new selection
  };

  const validateCreateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!selectedFile) newErrors.file = 'File is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStudyMaterial = async () => {
    if (!validateCreateForm()) return;
    setLoading(true);
    
    const uploadFormData = new FormData();
    uploadFormData.append('title', formData.title);
    uploadFormData.append('description', formData.description);
    uploadFormData.append('file', selectedFile);

    try {
      await axios.post('/direct-meet-study-material/post', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('Study material uploaded successfully!');
      setShowCreateModal(false); resetForm(); fetchStudyMaterials();
    } catch (error) {
      console.error('Failed to upload material:', error);
      setSuccessMessage(error.response?.data?.message || 'Failed to upload material.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const openEditModal = (material) => {
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      fileUrl: material.fileUrl, // Display current file URL
    });
    setSelectedFile(null); // Clear any previously selected file for create
    setErrors({});
    setShowEditModal(true);
  };
  
  const validateEditForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    // No file validation for edit as we are not re-uploading
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateStudyMaterial = async () => {
    if (!validateEditForm() || !selectedMaterial) return;
    setLoading(true);
    try {
      // Only send title and description for update as per backend
      const updateData = { title: formData.title, description: formData.description, fileUrl: formData.fileUrl };
      await axios.put(`/direct-meet-study-material/${selectedMaterial._id}`, updateData);
      setSuccessMessage('Study material updated successfully!');
      setShowEditModal(false); resetForm(); fetchStudyMaterials();
    } catch (error) {
      console.error('Failed to update material:', error);
      setSuccessMessage(error.response?.data?.message || 'Failed to update material.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDeleteStudyMaterial = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this study material?')) {
      setLoading(true);
      try {
        await axios.delete(`/direct-meet-study-material/${materialId}`);
        setSuccessMessage('Study material deleted successfully!');
        fetchStudyMaterials();
      } catch (error) {
        console.error('Failed to delete material:', error);
        setSuccessMessage(error.response?.data?.message || 'Failed to delete material.');
      } finally {
        setLoading(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  };
  
  const getFileTypeIcon = (fileType) => {
    if (!fileType) return '📄'; // Default icon
    if (fileType.includes('pdf')) return { icon: '📜', color: colors.fileTypeColors.pdf }; // PDF
    if (fileType.includes('word') || fileType.includes('doc')) return { icon: '✍️', color: colors.fileTypeColors.doc }; // Word
    if (fileType.includes('presentation') || fileType.includes('ppt')) return { icon: '📊', color: colors.fileTypeColors.ppt }; // PPT
    if (fileType.includes('excel') || fileType.includes('sheet')) return { icon: '📈', color: colors.fileTypeColors.xls }; // Excel
    if (fileType.startsWith('image/')) return { icon: '🖼️', color: colors.fileTypeColors.image }; // Image
    if (fileType.startsWith('video/')) return { icon: '🎞️', color: colors.fileTypeColors.video }; // Video
    if (fileType.startsWith('audio/')) return { icon: '🎧', color: colors.fileTypeColors.audio }; // Audio
    if (fileType.includes('zip') || fileType.includes('archive')) return { icon: '📦', color: colors.fileTypeColors.archive }; // Archive
    return { icon: '📄', color: colors.fileTypeColors.default }; // Default
  };

  // Styles
  const styles = {
    pageContainer: { minHeight: '100vh', background: colors.bgRoot, padding: '32px', fontFamily: typography.fontFamily },
    successMessage: { position: 'fixed', top: '16px', right: '16px', zIndex: 1050, padding: '12px 24px', borderRadius: '8px', boxShadow: shadows.lg, animation: 'bounce-custom 1s ease-in-out', color: colors.white },
    headerContainer: { maxWidth: '1280px', margin: '0 auto 32px auto' },
    headerFlex: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' },
    headerTitleGroup: { display: 'flex', alignItems: 'center', gap: '24px' },
    headerTitle: { fontSize: '28px', fontWeight: 'bold', color: colors.textPrimary },
    headerSubtitle: { color: colors.textSecondary, marginTop: '4px', fontSize: '15px' },
    headerActions: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
    button: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s ease-in-out', outline: 'none', display: 'flex', alignItems: 'center', gap: '8px' },
    buttonPrimary: { backgroundColor: colors.primary, color: colors.white, boxShadow: shadows.md, },
    buttonPrimaryHover: { backgroundColor: colors.primaryDark, transform: 'translateY(-2px)' },
    buttonSecondary: { backgroundColor: colors.white, color: colors.textSecondary, border: `1px solid ${colors.borderDefault}`, boxShadow: shadows.sm },
    buttonSecondaryHover: { backgroundColor: colors.bgLighter, borderColor: colors.textLight, color: colors.textPrimary, transform: 'translateY(-1px)' },
    backButtonIcon: { width: '18px', height: '18px', strokeWidth: '2.5' },
    loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '384px', width: '100%' },
    spinner: { borderRadius: '50%', height: '48px', width: '48px', borderTop: `3px solid ${colors.primary}`, borderRight: `3px solid ${colors.primary}`, borderBottom: `3px solid ${colors.primary}`, borderLeft: '3px solid transparent', animation: 'spin 1s linear infinite' },
    materialsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', maxWidth: '1280px', margin: '0 auto' },
    materialCard: { backgroundColor: colors.white, borderRadius: '12px', boxShadow: shadows.md, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out', position: 'relative' },
    materialCardHover: { transform: 'translateY(-5px)', boxShadow: shadows.lg },
    cardFileTypeIconContainer: { width: '48px', height: '48px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '24px' },
    cardTitle: { fontSize: '18px', fontWeight: '600', color: colors.textPrimary, marginBottom: '8px', wordBreak: 'break-word' },
    cardDescription: { fontSize: '14px', color: colors.textSecondary, marginBottom: '16px', flexGrow: 1, lineHeight: '1.6', maxHeight: '100px', overflowY: 'auto', wordBreak: 'break-word' },
    cardMeta: { fontSize: '12px', color: colors.textLight, marginBottom: '16px' },
    cardActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: `1px solid ${colors.borderLight}`, paddingTop: '16px', marginTop: 'auto' },
    actionButtonSmall: { padding: '6px 12px', fontSize: '13px', borderRadius: '6px' },
    downloadButton: { backgroundColor: colors.success, color: colors.white },
    downloadButtonHover: { backgroundColor: '#059669' },
    editButtonSmall: { backgroundColor: colors.primary, color: colors.white },
    editButtonSmallHover: { backgroundColor: colors.primaryDark },
    deleteButtonSmall: { backgroundColor: colors.deleteColor, color: colors.white },
    deleteButtonSmallHover: { backgroundColor: colors.deleteDark },
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' },
    modalContent: { backgroundColor: colors.white, borderRadius: '16px', boxShadow: shadows.modal, width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    modalInnerPadding: { padding: '24px' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '12px', marginBottom: '24px' },
    modalTitle: { fontSize: '22px', fontWeight: 'bold', color: colors.textPrimary },
    modalCloseButton: { color: colors.textLight, background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
    modalCloseButtonIcon: { height: '24px', width: '24px' },
    modalActions: { marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: `1px solid ${colors.borderLight}` },
    noMaterialsText: { textAlign: 'center', fontSize: '18px', color: colors.textSecondary, padding: '40px', fontStyle: 'italic' },
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce-custom { 0%, 100% { transform: translateY(-10%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); } }
      `}</style>
      <div style={styles.pageContainer}>
        {successMessage && (
          <div style={{...styles.successMessage, backgroundColor: successMessage.toLowerCase().includes('error') || successMessage.toLowerCase().includes('failed') || successMessage.toLowerCase().includes('unauthorized') ? colors.error : colors.success }}>
            {successMessage}
          </div>
        )}
        
        <div style={styles.headerContainer}>
          <div style={styles.headerFlex}>
            <div style={styles.headerTitleGroup}>
              <button onClick={() => window.history.back()} style={{ ...styles.button, ...styles.buttonSecondary, ...(isBackButtonHovered && styles.buttonSecondaryHover) }} onMouseEnter={() => setIsBackButtonHovered(true)} onMouseLeave={() => setIsBackButtonHovered(false)} disabled={loading}>
                <svg style={styles.backButtonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                <span>Back</span>
              </button>
              <div>
                <h1 style={styles.headerTitle}>Study Materials</h1>
                <p style={styles.headerSubtitle}>Manage and access study resources.</p>
              </div>
            </div>
            <div style={styles.headerActions}>
              <button onClick={() => { resetForm(); setShowCreateModal(true); }} style={{ ...styles.button, ...styles.buttonPrimary, ...(isAddButtonHovered && styles.buttonPrimaryHover) }} onMouseEnter={() => setIsAddButtonHovered(true)} onMouseLeave={() => setIsAddButtonHovered(false)} disabled={loading}>
                 <svg style={styles.backButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Upload Material
              </button>
            </div>
          </div>
        </div>

        {loading && !studyMaterials.length ? (
          <div style={styles.loadingContainer}><div style={styles.spinner}></div></div>
        ) : studyMaterials.length === 0 && !loading ? (
            <p style={styles.noMaterialsText}>No study materials found. Upload some to get started!</p>
        ) : (
          <div style={styles.materialsGrid}>
            {studyMaterials.map((material) => {
                const fileTypeMeta = getFileTypeIcon(material.fileType);
                return (
                <div 
                    key={material._id} 
                    style={{...styles.materialCard, ...(hoveredCardId === material._id && styles.materialCardHover)}}
                    onMouseEnter={() => setHoveredCardId(material._id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                >
                    <div>
                        <div style={{...styles.cardFileTypeIconContainer, backgroundColor: fileTypeMeta.color + '20' /* 20 for alpha */}}>
                            <span style={{color: fileTypeMeta.color}}>{fileTypeMeta.icon}</span>
                        </div>
                        <h3 style={styles.cardTitle}>{material.title}</h3>
                        <p style={styles.cardDescription}>{material.description}</p>
                        <p style={styles.cardMeta}>
                            Type: {material.fileType || 'Unknown'} | Uploaded: {new Date(material.uploadedAt || material.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div style={styles.cardActions}>
                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" style={{...styles.button, ...styles.actionButtonSmall, ...styles.downloadButton, textDecoration: 'none'}}
                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.downloadButtonHover.backgroundColor}
                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.downloadButton.backgroundColor}
                        >
                            <svg style={{width: '14px', height: '14px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Download
                        </a>
                        <button onClick={() => openEditModal(material)} style={{...styles.button, ...styles.actionButtonSmall, ...styles.editButtonSmall}}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.editButtonSmallHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.editButtonSmall.backgroundColor}
                                disabled={loading}>Edit</button>
                        <button onClick={() => handleDeleteStudyMaterial(material._id)} style={{...styles.button, ...styles.actionButtonSmall, ...styles.deleteButtonSmall}}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.deleteButtonSmallHover.backgroundColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.deleteButtonSmall.backgroundColor}
                                disabled={loading}>Delete</button>
                    </div>
                </div>
            )})}
          </div>
        )}
        {/* No pagination controls as backend doesn't support it for this endpoint */}


        {/* Create Material Modal */}
        {showCreateModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalInnerPadding}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>Upload New Study Material</h3>
                  <button onClick={() => { if(!loading) {setShowCreateModal(false); resetForm();} }} style={styles.modalCloseButton} disabled={loading}>
                    <svg style={styles.modalCloseButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <StudyMaterialFormFields formData={formData} handleFormChange={handleFormChange} handleFileChange={handleFileChange} selectedFile={selectedFile} errors={errors} />
                <div style={styles.modalActions}>
                  <button type="button" onClick={() => { if(!loading) {setShowCreateModal(false); resetForm(); }}} style={{...styles.button, ...styles.buttonSecondary, ...(loading && {opacity: 0.7, cursor: 'not-allowed'})}} disabled={loading}>Cancel</button>
                  <button type="button" onClick={handleAddStudyMaterial} style={{...styles.button, ...styles.buttonPrimary, ...(isModalActionButtonHovered && styles.buttonPrimaryHover), ...(loading && {backgroundColor: colors.primaryDark, cursor: 'not-allowed'})}} onMouseEnter={() => setIsModalActionButtonHovered(true)} onMouseLeave={() => setIsModalActionButtonHovered(false)} disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Material'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Material Modal */}
        {showEditModal && selectedMaterial && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalInnerPadding}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>Edit Study Material Details</h3>
                  <button onClick={() => { if(!loading) {setShowEditModal(false); resetForm();} }} style={styles.modalCloseButton} disabled={loading}>
                    <svg style={styles.modalCloseButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <StudyMaterialFormFields formData={formData} handleFormChange={handleFormChange} errors={errors} isEdit={true} />
                <div style={styles.modalActions}>
                  <button type="button" onClick={() => { if(!loading) {setShowEditModal(false); resetForm(); }}} style={{...styles.button, ...styles.buttonSecondary, ...(loading && {opacity: 0.7, cursor: 'not-allowed'})}} disabled={loading}>Cancel</button>
                  <button type="button" onClick={handleUpdateStudyMaterial} style={{...styles.button, ...styles.buttonPrimary, ...(isModalActionButtonHovered && styles.buttonPrimaryHover), ...(loading && {backgroundColor: colors.primaryDark, cursor: 'not-allowed'})}} onMouseEnter={() => setIsModalActionButtonHovered(true)} onMouseLeave={() => setIsModalActionButtonHovered(false)} disabled={loading}>
                    {loading ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DirectMeetStudyMaterialManagement;