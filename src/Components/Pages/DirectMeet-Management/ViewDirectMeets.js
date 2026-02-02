import React, { useState, useEffect, useCallback } from "react";
import axios from "../../../Utils/api";
import { useNavigate } from "react-router-dom";
import { 
  FiSearch, 
  FiFilter, 
  FiEdit3, 
  FiTrash2, 
  FiEye, 
  FiPlus, 
  FiArrowLeft,
  FiCalendar,
  FiMoreVertical,
  FiRefreshCw,
} from "react-icons/fi";

const ViewDirectMeets = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const limit = 10;

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (activeFilter) params.is_active = activeFilter;

      const response = await axios.get("/get-all-direct-meets", { params });
      
      if (response.data.success) {
        setMeetings(response.data.directMeets);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setError("Failed to fetch meetings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, activeFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMeetings();
    setRefreshing(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/delete-direct-meet/${id}`);
      if (response.data.success) {
        fetchMeetings();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      setError("Failed to delete meeting. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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

  const getStatusBadge = (status) => (
    <span style={{
      background: getStatusColor(status),
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

  if (loading && !refreshing) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem",
          }} />
          <p style={{ color: "#64748b" }}>Loading meetings...</p>
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
                DirectMeet Meetings
              </h1>
              <p style={{
                color: "#64748b",
                margin: "0.5rem 0 0 0",
              }}>
                Manage all your DirectMeet sessions ({totalRecords} total)
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
              onClick={() => navigate("/schoolemy/schedule-meeting")}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
              }}
            >
              <FiPlus style={{ marginRight: "0.5rem" }} />
              Schedule New Meeting
            </button>
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
                placeholder="Search meetings by ID, title, or description..."
                value={searchTerm}
                onChange={handleSearch}
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
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                <option value="">Active Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                  setCurrentPage(1);
                }}
                style={{
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="meet_title-asc">Title A-Z</option>
                <option value="meet_title-desc">Title Z-A</option>
                <option value="fees-desc">Highest Fees</option>
                <option value="fees-asc">Lowest Fees</option>
                <option value="apply_meet_start_date-desc">Latest Start Date</option>
                <option value="apply_meet_start_date-asc">Earliest Start Date</option>
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

        {/* Meetings Grid */}
        {meetings.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "3rem",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <FiCalendar style={{ fontSize: "3rem", color: "#d1d5db", marginBottom: "1rem" }} />
            <h3 style={{ color: "#6b7280", marginBottom: "0.5rem" }}>No meetings found</h3>
            <p style={{ color: "#9ca3af" }}>
              {searchTerm || statusFilter || activeFilter 
                ? "Try adjusting your search or filters" 
                : "Create your first DirectMeet to get started"}
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}>
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "1rem",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                      <h3 style={{
                        color: "#1e293b",
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        margin: 0,
                        marginRight: "0.75rem",
                      }}>
                        {meeting.meet_title}
                      </h3>
                      {getStatusBadge(meeting.status)}
                    </div>
                    <p style={{
                      color: "#64748b",
                      fontSize: "0.875rem",
                      margin: 0,
                      fontWeight: 600,
                    }}>
                      ID: {meeting.meet_id}
                    </p>
                  </div>

                  <div style={{ position: "relative" }}>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.25rem",
                        cursor: "pointer",
                        color: "#64748b",
                      }}
                    >
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  color: "#64748b",
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  marginBottom: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {meeting.description}
                </p>

                {/* Info Grid */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.875rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ 
                      color: "#10b981", 
                      marginRight: "0.5rem", 
                      fontWeight: "bold",
                      fontSize: "1rem"
                    }}>
                      ₹
                    </span>
                    <span style={{ color: "#374151", fontWeight: 600 }}>
                      {meeting.fees.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FiCalendar style={{ color: "#3b82f6", marginRight: "0.5rem" }} />
                    <span style={{ color: "#374151" }}>
                      {new Date(meeting.apply_meet_start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ gridColumn: "1 / -1", paddingTop: "0.5rem" }}>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      Applications: {formatDate(meeting.apply_meet_start_date)} - {formatDate(meeting.apply_meet_end_date)}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>
                      Meeting: {formatDate(meeting.meet_conduct_from_date)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/schoolemy/meeting-details/${meeting._id}`);
                    }}
                    style={{
                      background: "#f1f5f9",
                      color: "#334155",
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
                    <FiEye />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/schoolemy/edit-meeting/${meeting._id}`);
                    }}
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
                    title="Edit Meeting"
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(meeting._id);
                    }}
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
                    title="Delete Meeting"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} meetings
            </div>
            
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={{
                  background: currentPage === 1 ? "#f8fafc" : "white",
                  color: currentPage === 1 ? "#94a3b8" : "#374151",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      background: currentPage === page ? "#667eea" : "white",
                      color: currentPage === page ? "white" : "#374151",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "0.5rem 0.75rem",
                      cursor: "pointer",
                      fontWeight: currentPage === page ? 600 : 400,
                    }}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={{
                  background: currentPage === totalPages ? "#f8fafc" : "white",
                  color: currentPage === totalPages ? "#94a3b8" : "#374151",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
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
              Are you sure you want to delete this meeting? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => setDeleteConfirm(null)}
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
                onClick={() => handleDelete(deleteConfirm)}
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

export default ViewDirectMeets;
