import React, { useState, useEffect, useCallback } from "react";
import axios from "../../../Utils/api";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiDollarSign, 
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiTrendingUp,
  FiAlertTriangle,
  FiMoreVertical,
  FiEye,
} from "react-icons/fi";

// Mock fee records - in real app, this would come from API
const mockFeeRecords = [
  {
    id: 1,
    participantName: "John Doe",
    participantEmail: "john.doe@example.com",
    meetingId: "DM202501001",
    meetingTitle: "Data Science Bootcamp",
    feeAmount: 5000,
    paidAmount: 5000,
    paymentStatus: "paid",
    paymentMethod: "UPI",
    transactionId: "TXN123456789",
    paymentDate: "2024-01-15T14:30:00Z",
    dueDate: "2024-01-20T23:59:59Z"
  },
  {
    id: 2,
    participantName: "Jane Smith",
    participantEmail: "jane.smith@example.com",
    meetingId: "DM202501001",
    meetingTitle: "Data Science Bootcamp",
    feeAmount: 5000,
    paidAmount: 0,
    paymentStatus: "pending",
    paymentMethod: null,
    transactionId: null,
    paymentDate: null,
    dueDate: "2024-01-20T23:59:59Z"
  },
  {
    id: 3,
    participantName: "Mike Johnson",
    participantEmail: "mike.johnson@example.com",
    meetingId: "DM202501002",
    meetingTitle: "Machine Learning Workshop",
    feeAmount: 3500,
    paidAmount: 3500,
    paymentStatus: "paid",
    paymentMethod: "Card",
    transactionId: "TXN987654321",
    paymentDate: "2024-01-17T09:15:00Z",
    dueDate: "2024-01-25T23:59:59Z"
  },
  {
    id: 4,
    participantName: "Sarah Wilson",
    participantEmail: "sarah.wilson@example.com",
    meetingId: "DM202501001",
    meetingTitle: "Data Science Bootcamp",
    feeAmount: 5000,
    paidAmount: 2500,
    paymentStatus: "partial",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN555666777",
    paymentDate: "2024-01-16T11:45:00Z",
    dueDate: "2024-01-20T23:59:59Z"
  }
];

const MeetingFees = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState("");
  const [feeRecords, setFeeRecords] = useState([]); // This would come from a payments API
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchFeeRecords = useCallback(() => {
    // Mock function - in real app, this would be an API call
    const selectedMeetingData = meetings.find(m => m._id === selectedMeeting);
    if (selectedMeetingData) {
      const meetingFeeRecords = mockFeeRecords.filter(record => 
        record.meetingId === selectedMeetingData.meet_id
      );
      setFeeRecords(meetingFeeRecords);
    }
  }, [meetings, selectedMeeting]);

  useEffect(() => {
    if (selectedMeeting) {
      fetchFeeRecords();
    }
  }, [selectedMeeting, fetchFeeRecords]);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMeetings();
    if (selectedMeeting) {
      fetchFeeRecords();
    }
    setRefreshing(false);
  };

  const filteredFeeRecords = feeRecords.filter(record => {
    const matchesSearch = record.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.participantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || record.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid": return "#10b981";
      case "pending": return "#f59e0b";
      case "partial": return "#3b82f6";
      case "failed": return "#ef4444";
      case "refunded": return "#6b7280";
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

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "UPI": return "📱";
      case "Card": return "💳";
      case "Bank Transfer": return "🏦";
      case "Cash": return "💵";
      default: return "💳";
    }
  };

  const calculateStats = () => {
    const total = filteredFeeRecords.reduce((sum, record) => sum + record.feeAmount, 0);
    const collected = filteredFeeRecords.reduce((sum, record) => sum + record.paidAmount, 0);
    const pending = total - collected;
    const paidCount = filteredFeeRecords.filter(r => r.paymentStatus === 'paid').length;
    const pendingCount = filteredFeeRecords.filter(r => r.paymentStatus === 'pending').length;
    
    return { total, collected, pending, paidCount, pendingCount };
  };

  const stats = calculateStats();

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
                Meeting Fees Management
              </h1>
              <p style={{
                color: "#64748b",
                margin: "0.5rem 0 0 0",
              }}>
                Track and manage all meeting fee payments
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
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
              }}
            >
              <FiDownload style={{ marginRight: "0.5rem" }} />
              Export Report
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
                    {meeting.meet_title} ({meeting.meet_id}) - ₹{meeting.fees.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedMeeting && (
          <>
            {/* Payment Statistics */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}>
              {/* Total Expected */}
              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}>
                  <div style={{
                    background: "#dbeafe",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <FiDollarSign style={{ color: "#1d4ed8", fontSize: "1.5rem" }} />
                  </div>
                  <FiTrendingUp style={{ color: "#10b981", fontSize: "1.25rem" }} />
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
                  ₹{stats.total.toLocaleString()}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Total Expected
                </div>
              </div>

              {/* Amount Collected */}
              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}>
                  <div style={{
                    background: "#dcfce7",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <FiCheckCircle style={{ color: "#16a34a", fontSize: "1.5rem" }} />
                  </div>
                  <span style={{ 
                    color: "#10b981", 
                    fontSize: "0.875rem", 
                    fontWeight: 600 
                  }}>
                    {stats.total > 0 ? Math.round((stats.collected / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
                  ₹{stats.collected.toLocaleString()}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Amount Collected
                </div>
              </div>

              {/* Pending Amount */}
              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}>
                  <div style={{
                    background: "#fef3c7",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <FiClock style={{ color: "#d97706", fontSize: "1.5rem" }} />
                  </div>
                  <FiAlertTriangle style={{ color: "#f59e0b", fontSize: "1.25rem" }} />
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
                  ₹{stats.pending.toLocaleString()}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Pending Amount
                </div>

              </div>

              {/* Paid Count */}
              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e2e8f0",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}>
                  <div style={{
                    background: "#ecfdf5",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <FiUser style={{ color: "#059669", fontSize: "1.5rem" }} />
                  </div>
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
                  {stats.paidCount}/{filteredFeeRecords.length}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Participants Paid
                </div>
              </div>
            </div>

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
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: showFilters ? "1.5rem" : "0",
              }}>
                {/* Search */}
                <div style={{ 
                  position: "relative", 
                  flex: "1", 
                  minWidth: "300px", 
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
                    placeholder="Search by participant name, email, or transaction ID..."
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

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  style={{
                    background: showFilters ? "#667eea" : "white",
                    color: showFilters ? "white" : "#64748b",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                  }}
                >
                  <FiFilter style={{ marginRight: "0.5rem" }} />
                  Filters
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid #e2e8f0",
                }}>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: "0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                    }}
                  >
                    <option value="">All Payment Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              )}
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

            {/* Fee Records Table */}
            {filteredFeeRecords.length === 0 ? (
              <div style={{
                background: "white",
                borderRadius: "12px",
                padding: "3rem",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}>
                <FiDollarSign style={{ fontSize: "3rem", color: "#d1d5db", marginBottom: "1rem" }} />
                <h3 style={{ color: "#6b7280", marginBottom: "0.5rem" }}>
                  {searchTerm || statusFilter ? "No fee records found" : "No fee records yet"}
                </h3>
                <p style={{ color: "#9ca3af" }}>
                  {searchTerm || statusFilter 
                    ? "Try adjusting your search or filters" 
                    : "Fee records will appear here when participants register"}
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
                  gridTemplateColumns: "1fr 1fr 100px 120px 120px 120px 80px",
                  gap: "1rem",
                  padding: "1rem 1.5rem",
                  background: "#f8fafc",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  borderBottom: "1px solid #e2e8f0",
                }}>
                  <div>Participant</div>
                  <div>Payment Details</div>
                  <div>Fee Amount</div>
                  <div>Paid Amount</div>
                  <div>Status</div>
                  <div>Date</div>
                  <div>Actions</div>
                </div>

                {/* Table Body */}
                <div>
                  {filteredFeeRecords.map((record) => (
                    <div
                      key={record.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 100px 120px 120px 120px 80px",
                        gap: "1rem",
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid #f1f5f9",
                        alignItems: "center",
                      }}
                    >
                      {/* Participant */}
                      <div>
                        <div style={{
                          fontWeight: 600,
                          color: "#1e293b",
                          marginBottom: "0.25rem",
                        }}>
                          {record.participantName}
                        </div>
                        <div style={{
                          fontSize: "0.875rem",
                          color: "#64748b",
                        }}>
                          {record.participantEmail}
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div>
                        {record.paymentMethod && (
                          <div style={{
                            fontSize: "0.875rem",
                            color: "#374151",
                            marginBottom: "0.25rem",
                            display: "flex",
                            alignItems: "center",
                          }}>
                            <span style={{ marginRight: "0.5rem" }}>
                              {getPaymentMethodIcon(record.paymentMethod)}
                            </span>
                            {record.paymentMethod}
                          </div>
                        )}
                        {record.transactionId && (
                          <div style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            fontFamily: "monospace",
                          }}>
                            {record.transactionId}
                          </div>
                        )}
                      </div>

                      {/* Fee Amount */}
                      <div style={{
                        fontWeight: 600,
                        color: "#374151",
                      }}>
                        ₹{record.feeAmount.toLocaleString()}
                      </div>

                      {/* Paid Amount */}
                      <div style={{
                        fontWeight: 600,
                        color: record.paidAmount === record.feeAmount ? "#10b981" : 
                               record.paidAmount > 0 ? "#3b82f6" : "#64748b",
                      }}>
                        ₹{record.paidAmount.toLocaleString()}
                      </div>

                      {/* Status */}
                      <div>
                        {getPaymentStatusBadge(record.paymentStatus)}
                      </div>

                      {/* Date */}
                      <div style={{
                        fontSize: "0.875rem",
                        color: "#374151",
                      }}>
                        {record.paymentDate 
                          ? new Date(record.paymentDate).toLocaleDateString()
                          : "Not paid"
                        }
                        <div style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          marginTop: "0.25rem",
                        }}>
                          Due: {new Date(record.dueDate).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{
                        display: "flex",
                        gap: "0.25rem",
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
                          title="View Details"
                        >
                          <FiEye style={{ fontSize: "0.875rem" }} />
                        </button>
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
                          <FiMoreVertical style={{ fontSize: "0.875rem" }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

export default MeetingFees;
