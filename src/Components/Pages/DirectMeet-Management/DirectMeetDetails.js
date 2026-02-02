import React, { useState, useEffect, useCallback } from "react";
import axios from "../../../Utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiTrash2, 
  FiCalendar,
  FiFileText,
  FiClock,
  FiUsers,
  FiInfo,
  FiLoader,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiShare2,
  FiDownload
} from "react-icons/fi";

const DirectMeetDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchMeetingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/get-direct-meet/${id}`);
      
      if (response.data.success) {
        setMeeting(response.data.directMeet);
      }
    } catch (error) {
      console.error("Error fetching meeting details:", error);
      setError("Failed to fetch meeting details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMeetingDetails();
  }, [fetchMeetingDetails]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/delete-direct-meet/${id}`);
      if (response.data.success) {
        navigate("/schoolemy/view-meetings");
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      setError("Failed to delete meeting. Please try again.");
    }
  };

  const handleMarkCompleted = async () => {
    try {
      const response = await axios.patch(`/mark-direct-meet-completed/${id}`, {
        meet_completed_date: new Date().toISOString()
      });
      
      if (response.data.success) {
        fetchMeetingDetails(); // Refresh data
      }
    } catch (error) {
      console.error("Error marking meeting as completed:", error);
      setError("Failed to mark meeting as completed. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "#3b82f6";
      case "ongoing": return "#10b981";
      case "completed": return "#6b7280";
      case "cancelled": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "upcoming": return <FiClock />;
      case "ongoing": return <FiLoader style={{ animation: "spin 2s linear infinite" }} />;
      case "completed": return <FiCheckCircle />;
      case "cancelled": return <FiXCircle />;
      default: return <FiInfo />;
    }
  };

  const getStatusBadge = (status) => (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      background: getStatusColor(status),
      color: "white",
      padding: "0.5rem 1rem",
      borderRadius: "12px",
      fontSize: "0.875rem",
      fontWeight: 600,
      textTransform: "capitalize",
    }}>
      {getStatusIcon(status)}
      <span style={{ marginLeft: "0.5rem" }}>{status}</span>
    </div>
  );

  const isApplicationOpen = () => {
    if (!meeting) return false;
    const now = new Date();
    const start = new Date(meeting.apply_meet_start_date);
    const end = new Date(meeting.apply_meet_end_date);
    return now >= start && now <= end;
  };

  const isMeetingOngoing = () => {
    if (!meeting) return false;
    const now = new Date();
    const conductDate = new Date(meeting.meet_conduct_from_date);
    const completedDate = meeting.meet_completed_date ? new Date(meeting.meet_completed_date) : null;
    return now >= conductDate && (!completedDate || now <= completedDate);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <FiLoader style={{
            fontSize: "3rem",
            color: "#667eea",
            animation: "spin 1s linear infinite",
            marginBottom: "1rem",
          }} />
          <p style={{ color: "#64748b" }}>Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          background: "white",
          padding: "3rem",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}>
          <FiAlertTriangle style={{ fontSize: "4rem", color: "#ef4444", marginBottom: "1.5rem" }} />
          <h2 style={{ color: "#1e293b", marginBottom: "1rem", fontSize: "1.5rem" }}>
            Meeting Not Found
          </h2>
          <p style={{ color: "#64748b", marginBottom: "2rem" }}>
            {error || "The requested meeting could not be found."}
          </p>
          <button
            onClick={() => navigate("/schoolemy/view-meetings")}
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
            Back to Meetings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      padding: "2rem 1rem",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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
              onClick={() => navigate("/schoolemy/view-meetings")}
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
                Meeting Details
              </h1>
              <p style={{
                color: "#64748b",
                margin: "0.5rem 0 0 0",
              }}>
                ID: {meeting.meet_id}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            {meeting.status !== 'completed' && (
              <button
                onClick={handleMarkCompleted}
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.75rem 1rem",
                  cursor: "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FiCheckCircle style={{ marginRight: "0.5rem" }} />
                Mark Completed
              </button>
            )}
            <button
              onClick={() => navigate(`/schoolemy/edit-meeting/${meeting._id}`)}
              style={{
                background: "white",
                color: "#1d4ed8",
                border: "1px solid #dbeafe",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                cursor: "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiEdit3 style={{ marginRight: "0.5rem" }} />
              Edit
            </button>
            <button
              onClick={() => setDeleteConfirm(true)}
              style={{
                background: "white",
                color: "#dc2626",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                cursor: "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiTrash2 style={{ marginRight: "0.5rem" }} />
              Delete
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          {/* Main Content */}
          <div>
            {/* Meeting Overview */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "1.5rem",
              }}>
                <div>
                  <h2 style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "#1e293b",
                    margin: "0 0 1rem 0",
                  }}>
                    {meeting.meet_title}
                  </h2>
                  {getStatusBadge(meeting.status)}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981" }}>
                    ₹{meeting.fees.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                    Meeting Fee
                  </div>
                </div>
              </div>

              <div style={{
                padding: "1.5rem",
                background: "#f8fafc",
                borderRadius: "12px",
                marginBottom: "1.5rem",
              }}>
                <h3 style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                }}>
                  <FiFileText style={{ marginRight: "0.5rem" }} />
                  Description
                </h3>
                <p style={{
                  color: "#64748b",
                  lineHeight: 1.6,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                }}>
                  {meeting.description}
                </p>
              </div>

              {/* Application Status */}
              {isApplicationOpen() && (
                <div style={{
                  background: "#dcfce7",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}>
                  <FiCheckCircle style={{ color: "#16a34a", marginRight: "0.5rem" }} />
                  <span style={{ color: "#166534", fontWeight: 600 }}>
                    Applications are currently open!
                  </span>
                </div>
              )}

              {isMeetingOngoing() && (
                <div style={{
                  background: "#dbeafe",
                  border: "1px solid #bfdbfe",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}>
                  <FiLoader style={{ 
                    color: "#2563eb", 
                    marginRight: "0.5rem",
                    animation: "spin 2s linear infinite"
                  }} />
                  <span style={{ color: "#1e40af", fontWeight: 600 }}>
                    Meeting is currently ongoing!
                  </span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
              }}>
                <FiCalendar style={{ marginRight: "0.5rem" }} />
                Meeting Timeline
              </h3>

              <div style={{ position: "relative" }}>
                {/* Timeline Line */}
                <div style={{
                  position: "absolute",
                  left: "1rem",
                  top: "2rem",
                  bottom: "2rem",
                  width: "2px",
                  background: "#e2e8f0",
                }} />

                {/* Timeline Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {/* Application Start */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      background: new Date() >= new Date(meeting.apply_meet_start_date) ? "#10b981" : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      zIndex: 1,
                    }}>
                      <FiCalendar style={{ 
                        color: new Date() >= new Date(meeting.apply_meet_start_date) ? "white" : "#94a3b8",
                        fontSize: "0.875rem"
                      }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#374151" }}>
                        Application Opens
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                        {formatDate(meeting.apply_meet_start_date)}
                      </div>
                    </div>
                  </div>

                  {/* Application End */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      background: new Date() >= new Date(meeting.apply_meet_end_date) ? "#10b981" : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      zIndex: 1,
                    }}>
                      <FiClock style={{ 
                        color: new Date() >= new Date(meeting.apply_meet_end_date) ? "white" : "#94a3b8",
                        fontSize: "0.875rem"
                      }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#374151" }}>
                        Application Closes
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                        {formatDate(meeting.apply_meet_end_date)}
                      </div>
                    </div>
                  </div>

                  {/* Meeting Start */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      background: new Date() >= new Date(meeting.meet_conduct_from_date) ? "#10b981" : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      zIndex: 1,
                    }}>
                      <FiUsers style={{ 
                        color: new Date() >= new Date(meeting.meet_conduct_from_date) ? "white" : "#94a3b8",
                        fontSize: "0.875rem"
                      }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#374151" }}>
                        Meeting Starts
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                        {formatDate(meeting.meet_conduct_from_date)}
                      </div>
                    </div>
                  </div>

                  {/* Meeting Complete */}
                  {meeting.meet_completed_date && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "50%",
                        background: "#10b981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "1rem",
                        zIndex: 1,
                      }}>
                        <FiCheckCircle style={{ color: "white", fontSize: "0.875rem" }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: "#374151" }}>
                          Meeting Completed
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                          {formatDate(meeting.meet_completed_date)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Quick Stats */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "2rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}>
              <h3 style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "1rem",
              }}>
                Quick Info
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                }}>
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Status</span>
                  <span style={{ fontWeight: 600, color: "#374151", textTransform: "capitalize" }}>
                    {meeting.status}
                  </span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                }}>
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Active</span>
                  <span style={{ 
                    fontWeight: 600, 
                    color: meeting.is_active ? "#10b981" : "#ef4444" 
                  }}>
                    {meeting.is_active ? "Yes" : "No"}
                  </span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                }}>
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Created</span>
                  <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.875rem" }}>
                    {new Date(meeting.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                }}>
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>Updated</span>
                  <span style={{ fontWeight: 600, color: "#374151", fontSize: "0.875rem" }}>
                    {new Date(meeting.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}>
              <h3 style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "1rem",
              }}>
                Actions
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  onClick={() => navigate(`/schoolemy/edit-meeting/${meeting._id}`)}
                  style={{
                    background: "#f1f5f9",
                    color: "#334155",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                    width: "100%",
                    justifyContent: "flex-start",
                  }}
                >
                  <FiEdit3 style={{ marginRight: "0.5rem" }} />
                  Edit Meeting
                </button>
                
                <button
                  style={{
                    background: "#f1f5f9",
                    color: "#334155",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                    width: "100%",
                    justifyContent: "flex-start",
                  }}
                >
                  <FiShare2 style={{ marginRight: "0.5rem" }} />
                  Share Meeting
                </button>
                
                <button
                  style={{
                    background: "#f1f5f9",
                    color: "#334155",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                    width: "100%",
                    justifyContent: "flex-start",
                  }}
                >
                  <FiDownload style={{ marginRight: "0.5rem" }} />
                  Export Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
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
            maxWidth: "400px",
            width: "90%",
            textAlign: "center",
          }}>
            <FiTrash2 style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "1rem" }} />
            <h3 style={{ color: "#1e293b", marginBottom: "1rem" }}>
              Delete Meeting
            </h3>
            <p style={{ color: "#64748b", marginBottom: "2rem" }}>
              Are you sure you want to delete "{meeting?.meet_title}"? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => setDeleteConfirm(false)}
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
                onClick={handleDelete}
                style={{
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
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

export default DirectMeetDetails;
