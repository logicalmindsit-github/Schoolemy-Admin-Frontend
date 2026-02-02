import React, { useState, useEffect, useCallback } from "react";
import axios from "../../../Utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { FiCalendar, FiDollarSign, FiFileText, FiCheckCircle, FiAlertCircle, FiArrowLeft, FiLoader } from "react-icons/fi";

const EditDirectMeet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    meet_title: "",
    description: "",
    apply_meet_start_date: "",
    apply_meet_end_date: "",
    meet_conduct_from_date: "",
    meet_completed_date: "",
    fees: "",
    status: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMeetingData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/get-direct-meet/${id}`);
      
      if (response.data.success) {
        const meeting = response.data.directMeet;
        
        // Format dates for datetime-local input
        const formatDateForInput = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        };

        const formattedData = {
          meet_title: meeting.meet_title || "",
          description: meeting.description || "",
          apply_meet_start_date: formatDateForInput(meeting.apply_meet_start_date),
          apply_meet_end_date: formatDateForInput(meeting.apply_meet_end_date),
          meet_conduct_from_date: formatDateForInput(meeting.meet_conduct_from_date),
          meet_completed_date: formatDateForInput(meeting.meet_completed_date),
          fees: meeting.fees || "",
          status: meeting.status || "upcoming",
        };

        setFormData(formattedData);
        setOriginalData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching meeting data:", error);
      setError("Failed to fetch meeting data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMeetingData();
  }, [fetchMeetingData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || "" : value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    const { meet_title, description, apply_meet_start_date, apply_meet_end_date, meet_conduct_from_date, fees } = formData;
    
    if (!meet_title || !description || !apply_meet_start_date || !apply_meet_end_date || !meet_conduct_from_date || fees === "") {
      setError("Please fill in all required fields");
      return false;
    }

    if (parseFloat(fees) < 0) {
      setError("Fees cannot be negative");
      return false;
    }

    const startDate = new Date(apply_meet_start_date);
    const endDate = new Date(apply_meet_end_date);
    const conductDate = new Date(meet_conduct_from_date);

    if (endDate <= startDate) {
      setError("Application end date must be after start date");
      return false;
    }

    if (conductDate < endDate) {
      setError("Meeting conduct date should be after or equal to application end date");
      return false;
    }

    if (formData.meet_completed_date) {
      const completedDate = new Date(formData.meet_completed_date);
      if (completedDate < conductDate) {
        setError("Meeting completed date must be after or equal to conduct date");
        return false;
      }
    }

    return true;
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      setError("No changes detected");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const submitData = {
        ...formData,
        fees: parseFloat(formData.fees),
      };

      // Remove empty meet_completed_date if not provided
      if (!submitData.meet_completed_date) {
        delete submitData.meet_completed_date;
      }

      const response = await axios.put(`/update-direct-meet/${id}`, submitData);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/schoolemy/view-meetings");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating DirectMeet:", error);
      setError(error.response?.data?.message || "Failed to update DirectMeet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setError("");
    setSuccess(false);
  };

  const handleMarkCompleted = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.patch(`/mark-direct-meet-completed/${id}`, {
        meet_completed_date: new Date().toISOString()
      });
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/schoolemy/view-meetings");
        }, 2000);
      }
    } catch (error) {
      console.error("Error marking meeting as completed:", error);
      setError("Failed to mark meeting as completed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <p style={{ color: "#64748b" }}>Loading meeting data...</p>
        </div>
      </div>
    );
  }

  if (success) {
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
          <FiCheckCircle style={{ fontSize: "4rem", color: "#10b981", marginBottom: "1.5rem" }} />
          <h2 style={{ color: "#1e293b", marginBottom: "1rem", fontSize: "1.5rem" }}>
            DirectMeet Updated Successfully!
          </h2>
          <p style={{ color: "#64748b", marginBottom: "2rem" }}>
            Your DirectMeet has been updated successfully. Redirecting to meetings view...
          </p>
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
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
      }}>
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
                Edit DirectMeet
              </h1>
              <p style={{
                color: "#64748b",
                margin: "0.5rem 0 0 0",
              }}>
                Update meeting details and settings
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          {formData.status !== 'completed' && (
            <button
              onClick={handleMarkCompleted}
              disabled={isSubmitting}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "0.75rem 1.5rem",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {isSubmitting ? "Processing..." : "Mark as Completed"}
            </button>
          )}
        </div>

        {/* Form */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          padding: "2rem",
          border: "1px solid #e2e8f0",
        }}>
          {error && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
            }}>
              <FiAlertCircle style={{ color: "#ef4444", marginRight: "0.5rem" }} />
              <span style={{ color: "#dc2626" }}>{error}</span>
            </div>
          )}

          {!hasChanges() && !error && (
            <div style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
              color: "#0369a1",
            }}>
              Make changes to the form fields to update the meeting
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}>
              {/* Meet Title */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  Meet Title *
                </label>
                <input
                  type="text"
                  name="meet_title"
                  value={formData.meet_title}
                  onChange={handleChange}
                  placeholder="e.g., Data Science Bootcamp"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>

              {/* Fees */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  <FiDollarSign style={{ display: "inline", marginRight: "0.25rem" }} />
                  Fees *
                </label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  min="0"
                  step="0.01"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "2rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "0.5rem",
              }}>
                <FiFileText style={{ display: "inline", marginRight: "0.25rem" }} />
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the DirectMeet details, objectives, and requirements..."
                required
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Date Fields */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}>
              {/* Application Start Date */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  <FiCalendar style={{ display: "inline", marginRight: "0.25rem" }} />
                  Application Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="apply_meet_start_date"
                  value={formData.apply_meet_start_date}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>

              {/* Application End Date */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  <FiCalendar style={{ display: "inline", marginRight: "0.25rem" }} />
                  Application End Date *
                </label>
                <input
                  type="datetime-local"
                  name="apply_meet_end_date"
                  value={formData.apply_meet_end_date}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>

              {/* Meet Conduct Date */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  <FiCalendar style={{ display: "inline", marginRight: "0.25rem" }} />
                  Meet Conduct Date *
                </label>
                <input
                  type="datetime-local"
                  name="meet_conduct_from_date"
                  value={formData.meet_conduct_from_date}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>

              {/* Meet Completed Date (Optional) */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}>
                  <FiCalendar style={{ display: "inline", marginRight: "0.25rem" }} />
                  Meet Completed Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="meet_completed_date"
                  value={formData.meet_completed_date}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}>
              <button
                type="button"
                onClick={handleReset}
                disabled={!hasChanges()}
                style={{
                  background: "white",
                  color: hasChanges() ? "#64748b" : "#94a3b8",
                  border: "1px solid #cbd5e1",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: hasChanges() ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                Reset Changes
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges()}
                style={{
                  background: (isSubmitting || !hasChanges()) 
                    ? "#94a3b8" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 2rem",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: (isSubmitting || !hasChanges()) ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSubmitting ? "Updating..." : "Update DirectMeet"}
              </button>
            </div>
          </form>
        </div>
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

export default EditDirectMeet;
