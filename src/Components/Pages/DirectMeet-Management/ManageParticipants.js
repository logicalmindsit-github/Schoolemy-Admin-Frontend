import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "../../../Utils/api";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiUsers, 
  FiSearch,
  FiEdit3,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiRefreshCw,
  FiUserPlus,
  FiUserMinus,
  FiMoreVertical
} from "react-icons/fi";

const ManageParticipants = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [participants, setParticipants] = useState([]); // This would come from a participants API
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock participants data - in real app, this would come from API
  const mockParticipants = useMemo(() => [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 9876543210",
      registrationDate: "2024-01-15T09:00:00Z",
      paymentStatus: "paid",
      meetingId: "DM202501001"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+91 8765432109",
      registrationDate: "2024-01-16T10:30:00Z",
      paymentStatus: "pending",
      meetingId: "DM202501001"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+91 7654321098",
      registrationDate: "2024-01-17T14:15:00Z",
      paymentStatus: "paid",
      meetingId: "DM202501002"
    }
  ], []);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get("/get-all-direct-meets", {
        params: { limit: 100, is_active: true }
      });
      
      if (response.data.success) {
        setMeetings(response.data.directMeets);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setError("Failed to fetch meetings. Please try again.");
    }
  };

  const fetchParticipants = useCallback(() => {
    // Mock function - in real app, this would be an API call
    const selectedMeetingData = meetings.find(m => m._id === selectedMeeting);
    if (selectedMeetingData) {
      const meetingParticipants = mockParticipants.filter(p => 
        p.meetingId === selectedMeetingData.meet_id
      );
      setParticipants(meetingParticipants);
    }
  }, [meetings, selectedMeeting, mockParticipants]);

  useEffect(() => {
    if (selectedMeeting) {
      fetchParticipants();
    }
  }, [selectedMeeting, fetchParticipants]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMeetings();
    if (selectedMeeting) {
      fetchParticipants();
    }
    setRefreshing(false);
  };

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.phone.includes(searchTerm)
  );

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid": return "#10b981";
      case "pending": return "#f59e0b";
      case "failed": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getPaymentStatusBadge = (status) => (
    <span style={{
      background: getPaymentStatusColor(status),
      color: "white",
      padding: "0.25rem 0.75rem",
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "capitalize",
    }}>
      {status}
    </span>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      padding: "2rem 1rem",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              onClick={() => navigate("/schoolemy/direct-meet-management")}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "0.75rem",
                marginRight: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiArrowLeft style={{ fontSize: "1.25rem", color: "#64748b" }} />
            </button>
            <div>
              <h1 style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: "#1e293b",
                margin: 0,
              }}>
                Manage Participants
              </h1>
              <p style={{
                color: "#64748b",
                margin: "0.5rem 0 0 0",
              }}>
                Add, remove, and manage meeting participants
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "0.75rem",
                cursor: refreshing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiRefreshCw style={{ 
                fontSize: "1.25rem", 
                color: "#64748b",
                animation: refreshing ? "spin 1s linear infinite" : "none"
              }} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!selectedMeeting}
              style={{
                background: selectedMeeting ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#94a3b8",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                cursor: selectedMeeting ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
              }}
            >
              <FiUserPlus style={{ marginRight: "0.5rem" }} />
              Add Participant
            </button>
          </div>
        </div>

        {/* Meeting Selection */}
        <div style={{
          background: "white",
          borderRadius: "12px",
          padding: "1.5rem",
          marginBottom: "2rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <div style={{ flex: "1", minWidth: "300px" }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}>
                Select Meeting
              </label>
              <select
                value={selectedMeeting}
                onChange={(e) => setSelectedMeeting(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                <option value="">Choose a meeting...</option>
                {meetings.map((meeting) => (
                  <option key={meeting._id} value={meeting._id}>
                    {meeting.meet_title} ({meeting.meet_id})
                  </option>
                ))}
              </select>
            </div>

            {selectedMeeting && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                fontSize: "0.875rem",
                color: "#64748b",
              }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FiUsers style={{ marginRight: "0.5rem" }} />
                  <span>{filteredParticipants.length} participants</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FiCalendar style={{ marginRight: "0.5rem" }} />
                  <span>
                    {meetings.find(m => m._id === selectedMeeting)?.status || "Unknown"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedMeeting && (
          <>
            {/* Search and Filters */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "2rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}>
              <div style={{ 
                position: "relative", 
                maxWidth: "500px" 
              }}>
                <FiSearch style={{
                  position: "absolute",
                  left: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  fontSize: "1.25rem",
                }} />
                <input
                  type="text"
                  placeholder="Search participants by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "2rem",
                color: "#dc2626",
              }}>
                {error}
              </div>
            )}

            {/* Participants List */}
            {filteredParticipants.length === 0 ? (
              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "3rem",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}>
                <FiUsers style={{ fontSize: "3rem", color: "#d1d5db", marginBottom: "1rem" }} />
                <h3 style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
                  {searchTerm ? "No participants found" : "No participants yet"}
                </h3>
                <p style={{ color: "#9ca3af" }}>
                  {searchTerm 
                    ? "Try adjusting your search terms" 
                    : "Add participants to this meeting to get started"}
                </p>
              </div>
            ) : (
              <div style={{
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
              }}>
                {/* Table Header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 120px 120px 80px",
                  gap: "1rem",
                  padding: "1rem 1.5rem",
                  background: "#f8fafc",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e2e8f0",
                }}>
                  <div>Participant</div>
                  <div>Contact</div>
                  <div>Registration Date</div>
                  <div>Payment Status</div>
                  <div>Actions</div>
                  <div></div>
                </div>

                {/* Table Body */}
                <div>
                  {filteredParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 120px 120px 80px",
                        gap: "1rem",
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid #f1f5f9",
                        alignItems: "center",
                      }}
                    >
                      {/* Participant Info */}
                      <div>
                        <div style={{
                          fontWeight: 600,
                          color: "#1e293b",
                          marginBottom: "0.25rem",
                        }}>
                          {participant.name}
                        </div>
                        <div style={{
                          fontSize: "0.875rem",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                        }}>
                          <FiUser style={{ marginRight: "0.25rem", fontSize: "0.75rem" }} />
                          ID: {participant.id}
                        </div>
                      </div>

                      {/* Contact */}
                      <div>
                        <div style={{
                          fontSize: "0.875rem",
                          color: "#374151",
                          marginBottom: "0.25rem",
                          display: "flex",
                          alignItems: "center",
                        }}>
                          <FiMail style={{ marginRight: "0.25rem", fontSize: "0.75rem" }} />
                          {participant.email}
                        </div>
                        <div style={{
                          fontSize: "0.875rem",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                        }}>
                          <FiPhone style={{ marginRight: "0.25rem", fontSize: "0.75rem" }} />
                          {participant.phone}
                        </div>
                      </div>

                      {/* Registration Date */}
                      <div style={{
                        fontSize: "0.875rem",
                        color: "#374151",
                      }}>
                        {new Date(participant.registrationDate).toLocaleDateString()}
                        <div style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          marginTop: "0.25rem",
                        }}>
                          {new Date(participant.registrationDate).toLocaleTimeString()}
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div>
                        {getPaymentStatusBadge(participant.paymentStatus)}
                      </div>

                      {/* Actions */}
                      <div style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}>
                        <button
                          style={{
                            background: "#dbeafe",
                            color: "#1d4ed8",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.5rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Edit Participant"
                        >
                          <FiEdit3 style={{ fontSize: "0.875rem" }} />
                        </button>
                        <button
                          style={{
                            background: "#fef2f2",
                            color: "#dc2626",
                            border: "none",
                            borderRadius: "6px",
                            padding: "0.5rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Remove Participant"
                        >
                          <FiUserMinus style={{ fontSize: "0.875rem" }} />
                        </button>
                      </div>

                      {/* More Options */}
                      <div>
                        <button
                          style={{
                            background: "transparent",
                            border: "none",
                            borderRadius: "4px",
                            padding: "0.5rem",
                            cursor: "pointer",
                            color: "#64748b",
                          }}
                        >
                          <FiMoreVertical />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginTop: "2rem",
            }}>
              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}>
                  {filteredParticipants.length}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Total Participants
                </div>
              </div>

              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#10b981",
                  marginBottom: "0.5rem",
                }}>
                  {filteredParticipants.filter(p => p.paymentStatus === 'paid').length}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Paid Participants
                </div>
              </div>

              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#f59e0b",
                  marginBottom: "0.5rem",
                }}>
                  {filteredParticipants.filter(p => p.paymentStatus === 'pending').length}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Pending Payments
                </div>
              </div>

              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
                textAlign: "center",
              }}>
                <div style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#3b82f6",
                  marginBottom: "0.5rem",
                }}>
                  {filteredParticipants.length > 0 
                    ? Math.round((filteredParticipants.filter(p => p.paymentStatus === 'paid').length / filteredParticipants.length) * 100)
                    : 0}%
                </div>
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Payment Rate
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Participant Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "500px",
            width: "90%",
          }}>
            <h3 style={{ color: "#1e293b", marginBottom: "1.5rem", fontSize: "1.25rem" }}>
              Add New Participant
            </h3>
            
            <form>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  placeholder="Enter participant's full name"
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  placeholder="Enter email address"
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  placeholder="Enter phone number"
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: "white",
                    color: "#64748b",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Add Participant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ManageParticipants;
