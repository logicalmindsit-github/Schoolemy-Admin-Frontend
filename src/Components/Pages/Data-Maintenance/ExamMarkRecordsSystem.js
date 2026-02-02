import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../../Utils/api';


// Define style constants
const colors = {
  primary: '#4F46E5', primaryDark: '#4338CA', textPrimary: '#1F2937',
  textSecondary: '#4B5563', textLight: '#6B7280', borderLight: '#E5E7EB',
  borderDefault: '#D1D5DB', bgRoot: 'linear-gradient(to bottom right, #F9FAFB, #F3F4F6)',
  bgLight: '#F9FAFB', bgLighter: '#F3F4F6', white: '#FFFFFF', black: '#000000',
  success: '#10B981', error: '#EF4444', delete: '#DC2626',
  warning: '#F59E0B', info: '#3B82F6',
  gradeColors: {
    'A+': '#10B981', 'A': '#22C55E', 'B': '#84CC16', 'C': '#FACC15',
    'D': '#F59E0B', 'E': '#EF4444', 'F': '#DC2626',
  },
  statusColors: {
    'Pass': '#10B981', 'Fail': '#EF4444', 'Absent': '#9CA3AF',
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

// --- Reusable Record Form Fields Component ---
const RecordFormFields = ({ formData, handleChange, errors }) => {
  const formStyles = { // Renamed to avoid conflict
    formGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' },
    formLabel: { display: 'block', fontSize: '14px', fontWeight: '500', color: colors.textSecondary, marginBottom: '4px' },
    formInput: { width: '100%', padding: '10px 16px', borderRadius: '8px', border: `1px solid ${colors.borderDefault}`, fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s', outline: 'none' },
    formInputFocus: { borderColor: colors.primary, boxShadow: `0 0 0 1px ${colors.primary}` },
    formInputError: { borderColor: colors.error },
    formErrorText: { marginTop: '4px', fontSize: '12px', color: colors.error },
  };

  const handleFocus = (e) => { e.target.style.borderColor = colors.primary; e.target.style.boxShadow = formStyles.formInputFocus.boxShadow; }
  const handleBlur = (e) => {
    e.target.style.boxShadow = 'none';
    if (errors[e.target.name]) e.target.style.borderColor = colors.error;
    else e.target.style.borderColor = colors.borderDefault;
  };

  const gradeOptions = ['A+', 'A', 'B', 'C', 'D', 'E', 'F'];
  const statusOptions = ['Pass', 'Fail', 'Absent'];

  return (
    <div style={formStyles.formGrid}>
      <div>
        <label style={formStyles.formLabel}>Student Name *</label>
        <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={{ ...formStyles.formInput, ...(errors.studentName && formStyles.formInputError) }} placeholder="Jane Doe" />
        {errors.studentName && <p style={formStyles.formErrorText}>{errors.studentName}</p>}
      </div>
      <div>
        <label style={formStyles.formLabel}>Student ID *</label>
        <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={{ ...formStyles.formInput, ...(errors.studentId && formStyles.formInputError) }} placeholder="S12345" />
        {errors.studentId && <p style={formStyles.formErrorText}>{errors.studentId}</p>}
      </div>
      <div>
        <label style={formStyles.formLabel}>Grade *</label>
        <select name="grade" value={formData.grade} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={{ ...formStyles.formInput, ...(errors.grade && formStyles.formInputError) }}>
          <option value="">Select Grade</option>
          {gradeOptions.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        {errors.grade && <p style={formStyles.formErrorText}>{errors.grade}</p>}
      </div>
      <div>
        <label style={formStyles.formLabel}>Percentage *</label>
        <input type="number" name="percentage" value={formData.percentage} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={{ ...formStyles.formInput, ...(errors.percentage && formStyles.formInputError) }} placeholder="85.5" min="0" max="100" step="0.1" />
        {errors.percentage && <p style={formStyles.formErrorText}>{errors.percentage}</p>}
      </div>
      <div>
        <label style={formStyles.formLabel}>Mark *</label>
        <input type="number" name="mark" value={formData.mark} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={{ ...formStyles.formInput, ...(errors.mark && formStyles.formInputError) }} placeholder="86" min="0" />
        {errors.mark && <p style={formStyles.formErrorText}>{errors.mark}</p>}
      </div>
      <div>
        <label style={formStyles.formLabel}>Status *</label>
        <select name="status" value={formData.status} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={{ ...formStyles.formInput, ...(errors.status && formStyles.formInputError) }}>
          <option value="">Select Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.status && <p style={formStyles.formErrorText}>{errors.status}</p>}
      </div>
    </div>
  );
};

const ExamMarkManagement = () => {
  const [recordsData, setRecordsData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    studentName: '', studentId: '', grade: '', percentage: '', mark: '', status: ''
  });
  const [errors, setErrors] = useState({});
  const [filters, setFilters] = useState({ studentId: '', grade: '', status: '' });
  const [sortBy, setSortBy] = useState('createdAt:desc'); // e.g., 'mark:asc'
  const [successMessage, setSuccessMessage] = useState('');

  // Hover states
  const [isBackButtonHovered, setIsBackButtonHovered] = useState(false);
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);
  const [isDownloadButtonHovered, setIsDownloadButtonHovered] = useState(false);
  const [isStatsButtonHovered, setIsStatsButtonHovered] = useState(false);
  const [isCreateModalButtonHovered, setIsCreateModalButtonHovered] = useState(false);
  const [isUpdateModalButtonHovered, setIsUpdateModalButtonHovered] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [activeSort, setActiveSort] = useState({ key: 'createdAt', order: 'desc' });

  const limit = 10; // Records per page

  const handleSort = (key) => {
    const order = activeSort.key === key && activeSort.order === 'asc' ? 'desc' : 'asc';
    setActiveSort({ key, order });
    setSortBy(`${key}:${order}`);
    setCurrentPage(1); // Reset to first page on sort
  };


  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        sortBy,
      });
      if (filters.studentId) params.append('studentId', filters.studentId);
      if (filters.grade) params.append('grade', filters.grade);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`/exam-records/all?${params.toString()}`);
      setRecordsData(response.data.data);
      setTotalPages(response.data.pages);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error('Failed to fetch records:', error);
      setSuccessMessage(error.response?.data?.message || 'Error fetching records.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, sortBy]);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/exam-records/statistics');
      setStatistics(response.data.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      // Optional: Show error for stats, but don't block main table
      // setSuccessMessage(error.response?.data?.message || 'Error fetching statistics.');
      // setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false); // Consider separate loading state for stats if needed
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]); // fetchRecords is memoized with useCallback

  useEffect(() => { // Fetch stats on mount
    fetchStatistics();
  }, [fetchStatistics]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Student Name is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (formData.percentage === '' || isNaN(parseFloat(formData.percentage)) || parseFloat(formData.percentage) < 0 || parseFloat(formData.percentage) > 100) {
      newErrors.percentage = 'Valid percentage (0-100) is required';
    }
    if (formData.mark === '' || isNaN(parseFloat(formData.mark)) || parseFloat(formData.mark) < 0) {
      newErrors.mark = 'Valid mark (>=0) is required';
    }
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ studentName: '', studentId: '', grade: '', percentage: '', mark: '', status: '' });
    setErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateRecord = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.post('/exam-records/create', {
        ...formData,
        percentage: parseFloat(formData.percentage),
        mark: parseFloat(formData.mark),
      });
      setSuccessMessage('Record created successfully!');
      setShowCreateModal(false); resetForm(); fetchRecords(); fetchStatistics(); // Refresh stats too
    } catch (error) {
      console.error('Failed to create record:', error);
      setSuccessMessage(error.response?.data?.message || 'Failed to create record.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setFormData({
      studentName: record.studentName,
      studentId: record.studentId,
      grade: record.grade,
      percentage: record.percentage.toString(),
      mark: record.mark.toString(),
      status: record.status,
    });
    setShowEditModal(true);
  };

  const handleUpdateRecord = async () => {
    if (!validateForm() || !selectedRecord) return;
    setLoading(true);
    try {
      await axios.put(`/exam-records/update/${selectedRecord._id}`, {
        ...formData,
        percentage: parseFloat(formData.percentage),
        mark: parseFloat(formData.mark),
      });
      setSuccessMessage('Record updated successfully!');
      setShowEditModal(false); resetForm(); fetchRecords(); fetchStatistics();
    } catch (error) {
      console.error('Failed to update record:', error);
      setSuccessMessage(error.response?.data?.message || 'Failed to update record.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  
  const handleDownloadRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/exam-records/download', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'exam_records.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
      setSuccessMessage('Records downloaded successfully!');
    } catch (error) {
      console.error('Failed to download records:', error);
      setSuccessMessage(error.response?.data?.message || 'Failed to download records.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Styles
  const styles = {
    pageContainer: { minHeight: '100vh', background: colors.bgRoot, padding: '32px', fontFamily: typography.fontFamily },
    successMessage: { position: 'fixed', top: '16px', right: '16px', zIndex: 1050, padding: '12px 24px', borderRadius: '8px', boxShadow: shadows.lg, animation: 'bounce-custom 1s ease-in-out', color: colors.white },
    headerContainer: { maxWidth: '1600px', margin: '0 auto 32px auto' },
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
    filterBar: { display: 'flex', gap: '16px', marginBottom: '24px', padding: '20px', backgroundColor: colors.white, borderRadius: '12px', boxShadow: shadows.md },
    filterInput: { padding: '10px 16px', borderRadius: '8px', border: `1px solid ${colors.borderDefault}`, fontSize: '14px', outline: 'none', flexGrow: 1, minWidth: '150px' },
    mainContentContainer: { maxWidth: '1600px', margin: '0 auto', backgroundColor: colors.white, borderRadius: '16px', boxShadow: shadows.xl, overflow: 'hidden' },
    loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '384px' },
    spinner: { borderRadius: '50%', height: '48px', width: '48px', borderTop: `3px solid ${colors.primary}`, borderRight: `3px solid ${colors.primary}`, borderBottom: `3px solid ${colors.primary}`, borderLeft: '3px solid transparent', animation: 'spin 1s linear infinite' },
    tableOverflow: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHead: { backgroundColor: colors.bgLight },
    tableTh: { padding: '14px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${colors.borderLight}`, whiteSpace: 'nowrap', cursor: 'pointer' },
    tableThSortIcon: { marginLeft: '6px', fontSize: '10px', color: colors.textLight},
    tableThActiveSortIcon: {color: colors.primary},
    tableTd: { padding: '14px 20px', fontSize: '14px', color: colors.textPrimary, borderBottom: `1px solid ${colors.borderLight}`, whiteSpace: 'nowrap' },
    actionButton: { cursor: 'pointer', background: 'none', border: 'none', fontWeight: '500', transition: 'color 0.2s', padding: '4px 8px', borderRadius: '4px' },
    editButton: { color: colors.primary, marginRight: '10px' },
    editButtonHover: { color: colors.primaryDark, backgroundColor: colors.bgLighter },
    // Pagination (reusing from StaffManagement, minor tweaks)
    paginationContainer: { backgroundColor: colors.white, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${colors.borderLight}`, flexWrap: 'wrap', gap: '16px' },
    paginationInfo: { fontSize: '14px', color: colors.textSecondary },
    paginationNav: { display: 'inline-flex', borderRadius: '6px', boxShadow: shadows.sm, overflow: 'hidden' },
    paginationButton: { position: 'relative', display: 'inline-flex', alignItems: 'center', padding: '8px 16px', border: `1px solid ${colors.borderDefault}`, borderLeftWidth: '0', backgroundColor: colors.white, fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: colors.textLight, transition: 'background-color 0.2s, color 0.2s' },
    paginationButtonFirst: { borderLeftWidth: '1px', borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' },
    paginationButtonLast: { borderTopRightRadius: '6px', borderBottomRightRadius: '6px' },
    paginationButtonActive: { zIndex: 10, backgroundColor: colors.primary, borderColor: colors.primary, color: colors.white },
    paginationButtonDisabled: { color: colors.borderDefault, cursor: 'not-allowed', backgroundColor: colors.bgLight },
    paginationIcon: { height: '20px', width: '20px' },
    // Modal (reusing from StaffManagement)
    modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' },
    modalContent: { backgroundColor: colors.white, borderRadius: '16px', boxShadow: shadows.modal, width: '100%', maxWidth: '672px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
    modalInnerPadding: { padding: '24px' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.borderLight}`, paddingBottom: '12px', marginBottom: '24px' },
    modalTitle: { fontSize: '22px', fontWeight: 'bold', color: colors.textPrimary },
    modalCloseButton: { color: colors.textLight, background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
    modalCloseButtonIcon: { height: '24px', width: '24px' },
    modalActions: { marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: `1px solid ${colors.borderLight}` },
    // Statistics Section
    statsContainer: { marginTop: '32px', padding: '24px', backgroundColor: colors.white, borderRadius: '16px', boxShadow: shadows.xl },
    statsTitle: { fontSize: '24px', fontWeight: 'bold', color: colors.textPrimary, marginBottom: '20px', borderBottom: `2px solid ${colors.primary}`, paddingBottom: '10px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' },
    statCard: { backgroundColor: colors.bgLight, padding: '20px', borderRadius: '12px', boxShadow: shadows.md, textAlign: 'center' },
    statCardLabel: { fontSize: '14px', color: colors.textSecondary, marginBottom: '8px', textTransform: 'uppercase' },
    statCardValue: { fontSize: '28px', fontWeight: 'bold', color: colors.primary },
    gradeDistroTitle: { fontSize: '18px', fontWeight: '600', color: colors.textPrimary, marginTop: '24px', marginBottom: '12px' },
    gradeDistroList: { listStyle: 'none', padding: 0 },
    gradeDistroItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.borderLight}` },
    gradeDistroGrade: { fontWeight: '500', color: colors.textPrimary },
    gradeDistroCount: { color: colors.textSecondary },
    badge: (bgColor, textColor) => ({
        padding: '3px 10px', fontSize: '12px', fontWeight: '600', borderRadius: '12px',
        backgroundColor: bgColor || colors.bgLighter,
        color: textColor || colors.textPrimary,
        display: 'inline-block',
        minWidth: '60px', textAlign: 'center'
    }),
  };
  
  const gradeOptionsForFilter = ['A+', 'A', 'B', 'C', 'D', 'E', 'F'];
  const statusOptionsForFilter = ['Pass', 'Fail', 'Absent'];


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
                <h1 style={styles.headerTitle}>Exam Mark Records</h1>
                <p style={styles.headerSubtitle}>Manage and analyze student exam performance.</p>
              </div>
            </div>
            <div style={styles.headerActions}>
              <button onClick={handleDownloadRecords} style={{ ...styles.button, ...styles.buttonSecondary, ...(isDownloadButtonHovered && styles.buttonSecondaryHover) }} onMouseEnter={() => setIsDownloadButtonHovered(true)} onMouseLeave={() => setIsDownloadButtonHovered(false)} disabled={loading}>
                <svg style={styles.backButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Records
              </button>
              <button onClick={() => document.getElementById('statistics-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ ...styles.button, ...styles.buttonSecondary, ...(isStatsButtonHovered && styles.buttonSecondaryHover) }} onMouseEnter={() => setIsStatsButtonHovered(true)} onMouseLeave={() => setIsStatsButtonHovered(false)} disabled={loading || !statistics}>
                <svg style={styles.backButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                View Statistics
              </button>
              <button onClick={() => setShowCreateModal(true)} style={{ ...styles.button, ...styles.buttonPrimary, ...(isAddButtonHovered && styles.buttonPrimaryHover) }} onMouseEnter={() => setIsAddButtonHovered(true)} onMouseLeave={() => setIsAddButtonHovered(false)} disabled={loading}>
                 <svg style={styles.backButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Add New Record
              </button>
            </div>
          </div>

          <div style={styles.filterBar}>
            <input type="text" name="studentId" placeholder="Filter by Student ID..." value={filters.studentId} onChange={handleFilterChange} style={styles.filterInput} />
            <select name="grade" value={filters.grade} onChange={handleFilterChange} style={styles.filterInput}>
              <option value="">All Grades</option>
              {gradeOptionsForFilter.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select name="status" value={filters.status} onChange={handleFilterChange} style={styles.filterInput}>
              <option value="">All Statuses</option>
              {statusOptionsForFilter.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div style={styles.mainContentContainer}>
          {loading && !recordsData.length ? (
            <div style={styles.loadingContainer}><div style={styles.spinner}></div></div>
          ) : (
            <>
              <div style={styles.tableOverflow}>
                <table style={styles.table}>
                  <thead style={styles.tableHead}>
                    <tr>
                      {['studentName', 'studentId', 'grade', 'percentage', 'mark', 'status', 'createdAt'].map(key => (
                        <th key={key} style={styles.tableTh} onClick={() => handleSort(key)}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {/* Prettify key */}
                          {activeSort.key === key && (
                            <span style={{...styles.tableThSortIcon, ...(activeSort.key === key && styles.tableThActiveSortIcon)}}>
                              {activeSort.order === 'asc' ? '▲' : '▼'}
                            </span>
                          )}
                        </th>
                      ))}
                      <th style={{...styles.tableTh, textAlign: 'right'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody >
                    {recordsData.length === 0 && !loading ? (
                      <tr><td colSpan="8" style={{...styles.tableTd, textAlign: 'center', fontStyle: 'italic', color: colors.textLight }}>No exam records found.</td></tr>
                    ) : (
                      recordsData.map((record) => (
                        <tr key={record._id} style={{...(hoveredRowId === record._id && {backgroundColor: colors.bgLighter})}} onMouseEnter={() => setHoveredRowId(record._id)} onMouseLeave={() => setHoveredRowId(null)}>
                          <td style={styles.tableTd}>{record.studentName}</td>
                          <td style={styles.tableTd}>{record.studentId}</td>
                          <td style={styles.tableTd}><span style={styles.badge(colors.gradeColors[record.grade] || colors.bgLighter, colors.white)}>{record.grade}</span></td>
                          <td style={styles.tableTd}>{record.percentage.toFixed(1)}%</td>
                          <td style={styles.tableTd}>{record.mark}</td>
                          <td style={styles.tableTd}><span style={styles.badge(colors.statusColors[record.status] || colors.bgLighter, colors.white)}>{record.status}</span></td>
                          <td style={styles.tableTd}>{new Date(record.createdAt).toLocaleDateString()}</td>
                          <td style={{...styles.tableTd, textAlign: 'right'}}>
                            <button onClick={() => openEditModal(record)} style={{...styles.actionButton, ...styles.editButton}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bgLighter} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} disabled={loading}>Edit</button>
                            {/* Add Delete button if functionality is added */}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 0 && (
                <div style={styles.paginationContainer}>
                  <p style={styles.paginationInfo}>
                    Showing <span style={{fontWeight: '600'}}>{Math.min((currentPage - 1) * limit + 1, totalRecords)}</span> to{' '}
                    <span style={{fontWeight: '600'}}>{Math.min(currentPage * limit, totalRecords)}</span> of{' '}
                    <span style={{fontWeight: '600'}}>{totalRecords}</span> results
                  </p>
                  {totalPages > 1 && (
                    <nav style={styles.paginationNav} aria-label="Pagination">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading} style={{ ...styles.paginationButton, ...styles.paginationButtonFirst, ...((currentPage === 1 || loading) && styles.paginationButtonDisabled) }}>
                        <svg style={styles.paginationIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button key={i + 1} onClick={() => setCurrentPage(i + 1)} disabled={loading} style={{ ...styles.paginationButton, ...((currentPage === i + 1) && styles.paginationButtonActive), ...(loading && styles.paginationButtonDisabled) }}>
                          {i + 1}
                        </button>
                      ))}
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading} style={{ ...styles.paginationButton, ...styles.paginationButtonLast, ...((currentPage === totalPages || loading) && styles.paginationButtonDisabled) }}>
                        <svg style={styles.paginationIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                      </button>
                    </nav>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {statistics && (
          <div id="statistics-section" style={styles.statsContainer}>
            <h2 style={styles.statsTitle}>Exam Statistics</h2>
            {loading && !statistics ? <div style={{textAlign: 'center', color: colors.textLight}}>Loading statistics...</div> :
            !statistics ? <div style={{textAlign: 'center', color: colors.textLight}}>No statistics available.</div> : (
              <>
                <div style={styles.statsGrid}>
                  <div style={styles.statCard}><p style={styles.statCardLabel}>Total Students</p><p style={styles.statCardValue}>{statistics.totalStudents}</p></div>
                  <div style={styles.statCard}><p style={styles.statCardLabel}>Avg. Percentage</p><p style={styles.statCardValue}>{statistics.averagePercentage}%</p></div>
                  <div style={styles.statCard}><p style={styles.statCardLabel}>Avg. Mark</p><p style={styles.statCardValue}>{statistics.averageMark}</p></div>
                  <div style={styles.statCard}><p style={styles.statCardLabel}>Pass Rate</p><p style={styles.statCardValue}>{statistics.passRate}%</p></div>
                </div>
                <h3 style={styles.gradeDistroTitle}>Grade Distribution</h3>
                <ul style={styles.gradeDistroList}>
                  {statistics.gradeDistribution?.sort((a,b) => b.count - a.count).map(item => (
                    <li key={item.grade} style={styles.gradeDistroItem}>
                      <span style={styles.gradeDistroGrade}>Grade {item.grade}</span>
                      <span style={styles.gradeDistroCount}>{item.count} student(s)</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {/* Create Record Modal */}
        {showCreateModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalInnerPadding}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>Add New Exam Record</h3>
                  <button onClick={() => { if(!loading) {setShowCreateModal(false); resetForm();} }} style={styles.modalCloseButton} disabled={loading}>
                    <svg style={styles.modalCloseButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <RecordFormFields formData={formData} handleChange={handleFormChange} errors={errors} />
                <div style={styles.modalActions}>
                  <button type="button" onClick={() => { if(!loading) {setShowCreateModal(false); resetForm(); }}} style={{...styles.button, ...styles.buttonSecondary, ...(loading && {opacity: 0.7, cursor: 'not-allowed'})}} disabled={loading}>Cancel</button>
                  <button type="button" onClick={handleCreateRecord} style={{...styles.button, ...styles.buttonPrimary, ...(isCreateModalButtonHovered && styles.buttonPrimaryHover), ...(loading && {backgroundColor: colors.primaryDark, cursor: 'not-allowed'})}} onMouseEnter={() => setIsCreateModalButtonHovered(true)} onMouseLeave={() => setIsCreateModalButtonHovered(false)} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Record'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Record Modal */}
        {showEditModal && selectedRecord && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalInnerPadding}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>Edit Exam Record</h3>
                  <button onClick={() => { if(!loading) {setShowEditModal(false); resetForm();} }} style={styles.modalCloseButton} disabled={loading}>
                    <svg style={styles.modalCloseButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <RecordFormFields formData={formData} handleChange={handleFormChange} errors={errors} />
                <div style={styles.modalActions}>
                  <button type="button" onClick={() => { if(!loading) {setShowEditModal(false); resetForm(); }}} style={{...styles.button, ...styles.buttonSecondary, ...(loading && {opacity: 0.7, cursor: 'not-allowed'})}} disabled={loading}>Cancel</button>
                  <button type="button" onClick={handleUpdateRecord} style={{...styles.button, ...styles.buttonPrimary, ...(isUpdateModalButtonHovered && styles.buttonPrimaryHover), ...(loading && {backgroundColor: colors.primaryDark, cursor: 'not-allowed'})}} onMouseEnter={() => setIsUpdateModalButtonHovered(true)} onMouseLeave={() => setIsUpdateModalButtonHovered(false)} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Record'}
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

export default ExamMarkManagement;