import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from '../../../Utils/api';
import { useParams, Link } from 'react-router-dom';
import { FaUsers, FaEnvelope, FaMobileAlt, FaCalendarAlt, FaPercentage, FaTasks, FaUpload, FaTimes, FaArrowLeft } from 'react-icons/fa';

// --- (Styling-la endha maathramum illa, adhu apdiye irukkattum) ---
const PageContainer = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
`;
const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const SectionContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  margin-bottom: 2.5rem;
  border: 1px solid #e9ecef;
`;
const ResponsiveWrapper = styled.div`
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 1rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #dee2e6;
  }
  
  td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f3f5;
    color: #495057;
    vertical-align: middle;
  }

  tbody tr {
    transition: background-color 0.2s ease-in-out;
    &:hover {
      background-color: #f8f9fa;
    }
  }
`;
const EmailLink = styled.a`
  color: #007bff;
  font-weight: 500;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;
const StatusText = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #6c757d;
`;
const AttendanceManager = styled.div`
  padding: 2rem;
`;
const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;
const Label = styled.label`
  font-weight: 600;
  color: #343a40;
`;
const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  width: 80px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;
const StyledSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  background-color: #fff;
  min-width: 130px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;

  background-color: ${props => {
    if (props.value === 'Present') return 'rgba(40, 167, 69, 0.1)';
    if (props.value === 'Absent') return 'rgba(220, 53, 69, 0.1)';
    return '#fff';
  }};
  color: ${props => {
    if (props.value === 'Present') return '#155724';
    if (props.value === 'Absent') return '#721c24';
    return '#495057';
  }};
  border-color: ${props => {
    if (props.value === 'Present') return 'rgba(40, 167, 69, 0.5)';
    if (props.value === 'Absent') return 'rgba(220, 53, 69, 0.5)';
    return '#ced4da';
  }};
`;
const PercentageCell = styled.td`
  font-weight: 700;
  font-size: 1rem;
  color: ${props => (props.percentage >= 75 ? '#28a745' : props.percentage >= 50 ? '#fd7e14' : '#dc3545')};
`;
const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:disabled { 
    background-color: #ced4da !important; 
    cursor: not-allowed; 
    opacity: 0.7;
  }
`;
const SendButton = styled(ActionButton)`
  background-color: #17a2b8;
  &:hover:not(:disabled) { background-color: #138496; transform: translateY(-1px); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const scaleUp = keyframes`from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; }`;
const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(17, 24, 39, 0.6); z-index: 3000;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(5px); animation: ${fadeIn} 0.3s ease-out;
`;
const ModalContent = styled.div`
  background: white; padding: 2rem; border-radius: 12px;
  width: 90%; max-width: 500px; animation: ${scaleUp} 0.3s;
  position: relative;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
`;
const ModalTitle = styled.h2` margin-top: 0; color: #212529; font-size: 1.5rem; `;
const ModalCloseButton = styled.button`
  position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6c757d;
  &:hover { color: #212529; }
`;
const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: #fff;
  border: 1px solid #dee2e6;
  transition: all 0.2s;
  &:hover { 
    color: #212529;
    background-color: #f8f9fa;
    border-color: #adb5bd;
  }
`;


// --- Component ---
const PractiseclassList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendanceDays, setAttendanceDays] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { courseName } = useParams();

  const fetchRequests = useCallback(async () => {
    if (!courseName) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`/api/join-requests?courseName=${courseName}`, config);
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch data for this course.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseName]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

    const handleAttendanceChange = async (requestId, date, status) => {
       try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(
              `/api/join-requests/${requestId}/attendance`,
              { date, status },
              config
            );
            setRequests(prevRequests =>
                prevRequests.map(req => {
                    if (req._id === requestId) {
                        const newRecords = [...(req.attendanceRecords || [])]; // Safety check
                        const recordIndex = newRecords.findIndex(rec => rec.date === date);
                        if (recordIndex > -1) newRecords[recordIndex].status = status;
                        else newRecords.push({ date, status });
                        return { ...req, attendanceRecords: newRecords };
                    }
                    return req;
                })
            );
        } catch (err) {
            alert('Failed to update attendance.');
            console.error(err);
        }
    };

    const openSendModal = (request) => {
        setSelectedUser(request);
        setIsModalOpen(true);
    };

    const handleSendMaterial = async () => {
        if (!selectedFile || !selectedUser) return;
        setUploading(true);
        
        const formData = new FormData();
        formData.append('materialPdf', selectedFile);
        formData.append('userId', selectedUser.userId._id);
        formData.append('courseName', selectedUser.courseName);

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/materials/send', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                },
            });
            alert('Material sent successfully!');
            setIsModalOpen(false);
            setSelectedFile(null);
            fetchRequests();
        } catch (error) {
            alert('Failed to send material. Please check the console.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };
    
    if (loading) return <StatusText>Loading Requests...</StatusText>;
    if (error) return <StatusText>{error}</StatusText>;

    return (
        <PageContainer>
            <BackButton to="/schoolemy/practice-class-list">
                <FaArrowLeft /> Back to Course List
            </BackButton>

            <Header>
                <Title><FaUsers /> {decodeURIComponent(courseName)}</Title>
            </Header>

            <SectionContainer>
              <ResponsiveWrapper>
                <Table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th><FaEnvelope /> Email</th>
                            <th><FaMobileAlt /> Mobile Number</th>
                            <th><FaCalendarAlt /> Date Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? (
                            requests.map(req => (
                                <tr key={req._id}>
                                    <td>{req.name}</td>
                                    <td><EmailLink href={`mailto:${req.userId?.email}`}>{req.userId?.email || 'N/A'}</EmailLink></td>
                                    <td>{req.mobileNumber}</td>
                                    <td>{new Date(req.submittedAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No enrolled users found for this course.</td></tr>
                        )}
                    </tbody>
                </Table>
              </ResponsiveWrapper>
            </SectionContainer>
            
            <SectionContainer>
                <AttendanceManager>
                    <FormRow>
                        <Title as="h2" style={{fontSize: '1.75rem', marginBottom: 0}}><FaTasks /> Attendance Manager</Title>
                        <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <Label htmlFor="days">Attendance Days:</Label>
                          <Input
                              id="days" type="number" min="1" value={attendanceDays}
                              onChange={(e) => setAttendanceDays(parseInt(e.target.value, 10) || 1)}
                          />
                        </div>
                    </FormRow>
                    <ResponsiveWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    {Array.from({ length: attendanceDays }).map((_, index) => (
                                        <th key={index}>Day {index + 1}</th>
                                    ))}
                                    <th><FaPercentage /> Overall</th>
                                    <th>Actions</th>
                                    <th>Sent Material</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => {
                                    const visibleDays = Array.from({ length: attendanceDays }, (_, i) => `Day ${i + 1}`);
                                    
                                    // ✅ ITHA IPDI MAATHIRUKKOM (THE FIX IS HERE!) ✅
                                    const presentCount = (req.attendanceRecords || []).filter(r => 
                                        r.status === 'Present' && visibleDays.includes(r.date)
                                    ).length;

                                    const percentage = attendanceDays > 0 ? Math.round((presentCount / attendanceDays) * 100) : 0;
                                    
                                    return (
                                        <tr key={req._id}>
                                            <td>{req.name}</td>
                                            {Array.from({ length: attendanceDays }).map((_, index) => {
                                                const dateIdentifier = `Day ${index + 1}`;
                                                // ✅ ITHAYUM MAATHIRUKKOM (Safety Check)
                                                const record = (req.attendanceRecords || []).find(r => r.date === dateIdentifier);
                                                const currentStatus = record ? record.status : 'Not Marked';
                                                return (
                                                    <td key={index}>
                                                        <StyledSelect
                                                            value={currentStatus}
                                                            onChange={(e) => handleAttendanceChange(req._id, dateIdentifier, e.target.value)}
                                                        >
                                                            <option value="Not Marked">Not Marked</option>
                                                            <option value="Present">Present</option>
                                                            <option value="Absent">Absent</option>
                                                        </StyledSelect>
                                                    </td>
                                                );
                                            })}
                                            <PercentageCell percentage={percentage}>{percentage}%</PercentageCell>
                                            <td>
                                                <SendButton 
                                                    disabled={percentage < 75 || req.sentMaterial}
                                                    onClick={() => openSendModal(req)}
                                                >
                                                   <FaUpload /> {req.sentMaterial ? 'Sent' : 'Send'}
                                                </SendButton>
                                            </td>
                                            <td>
                                                {req.sentMaterial ? (
                                                    <EmailLink 
                                                        href={`${axios.defaults.baseURL}${req.sentMaterial.filePath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View PDF
                                                    </EmailLink>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </ResponsiveWrapper>
                </AttendanceManager>
            </SectionContainer>
            
            {isModalOpen && (
                <ModalBackdrop>
                    <ModalContent>
                        <ModalCloseButton onClick={() => setIsModalOpen(false)}><FaTimes /></ModalCloseButton>
                        <ModalTitle>Send Material to {selectedUser?.name}</ModalTitle>
                        <p><strong>Course:</strong> {selectedUser?.courseName}</p>
                        <input type="file" accept=".pdf" onChange={e => setSelectedFile(e.target.files[0])} style={{ display: 'block', margin: '1rem 0' }}/>
                        <SendButton 
                            style={{marginTop: '1.5rem', width: '100%', padding: '0.8rem'}} 
                            onClick={handleSendMaterial} 
                            disabled={!selectedFile || uploading}
                        >
                            {uploading ? 'Sending...' : 'Confirm & Send'}
                        </SendButton>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </PageContainer>
    );
};

export default PractiseclassList;