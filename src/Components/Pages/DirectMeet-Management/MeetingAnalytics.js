import React, { useState, useEffect } from "react";
import axios from "../../../Utils/api";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiTrendingUp, 
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiActivity,
  FiBarChart2,
  FiPieChart,
  FiRefreshCw,
  FiDownload,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const MeetingAnalytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await axios.get("/get-direct-meet-stats");
      
      // Fetch meetings for detailed analytics
      const meetingsResponse = await axios.get("/get-all-direct-meets", {
        params: { limit: 100, sort_by: "createdAt", sort_order: "desc" }
      });
      
      if (statsResponse.data.success && meetingsResponse.data.success) {
        setStats(statsResponse.data.stats);
        setMeetings(meetingsResponse.data.directMeets);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to fetch analytics data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
  };

  const calculateRevenueStats = () => {
    if (!meetings.length) return { total: 0, average: 0, highest: 0, lowest: 0 };
    
    const revenues = meetings.map(m => m.fees);
    const total = revenues.reduce((sum, fee) => sum + fee, 0);
    const average = total / revenues.length;
    const highest = Math.max(...revenues);
    const lowest = Math.min(...revenues);
    
    return { total, average, highest, lowest };
  };

  const getMonthlyData = () => {
    const monthlyStats = {};
    
    meetings.forEach(meeting => {
      const month = new Date(meeting.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      
      if (!monthlyStats[month]) {
        monthlyStats[month] = { count: 0, revenue: 0 };
      }
      
      monthlyStats[month].count++;
      monthlyStats[month].revenue += meeting.fees;
    });
    
    return Object.entries(monthlyStats)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-6); // Last 6 months
  };

  const getStatusDistribution = () => {
    const distribution = {};
    meetings.forEach(meeting => {
      distribution[meeting.status] = (distribution[meeting.status] || 0) + 1;
    });
    return distribution;
  };

  const revenueStats = calculateRevenueStats();
  const monthlyData = getMonthlyData();
  const statusDistribution = getStatusDistribution();

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
          <p style={{ color: "#64748b" }}>Loading analytics...</p>
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
                Meeting Analytics
              </h1>
              <p style={{
                color: "#64748b",
                margin: "0.5rem 0 0 0",
              }}>
                Comprehensive insights into your DirectMeet sessions
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "0.75rem",
                fontSize: "0.875rem",
                outline: "none",
              }}
            >
              <option value="all">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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

        {/* Key Metrics */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}>
          {/* Total Meetings */}
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
                <FiCalendar style={{ color: "#1d4ed8", fontSize: "1.5rem" }} />
              </div>
              <FiTrendingUp style={{ color: "#10b981", fontSize: "1.25rem" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
              {stats?.totalMeets || 0}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Total Meetings
            </div>
          </div>

          {/* Completed Meetings */}
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
                {stats?.totalMeets > 0 ? Math.round((stats.completedMeets / stats.totalMeets) * 100) : 0}%
              </span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
              {stats?.completedMeets || 0}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Completed Meetings
            </div>
          </div>

          {/* Ongoing Meetings */}
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
                <FiActivity style={{ color: "#d97706", fontSize: "1.5rem" }} />
              </div>
              <FiClock style={{ color: "#d97706", fontSize: "1.25rem" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
              {stats?.ongoingMeets || 0}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Ongoing Meetings
            </div>
          </div>

          {/* Total Revenue */}
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
                <FiDollarSign style={{ color: "#059669", fontSize: "1.5rem" }} />
              </div>
              <FiTrendingUp style={{ color: "#10b981", fontSize: "1.25rem" }} />
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
              ₹{revenueStats.total.toLocaleString()}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Total Revenue
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
          {/* Charts Section */}
          <div>
            {/* Monthly Trends */}
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
                alignItems: "center",
                marginBottom: "1.5rem",
              }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                }}>
                  <FiBarChart2 style={{ marginRight: "0.5rem" }} />
                  Monthly Trends
                </h3>
              </div>

              {/* Simple bar chart representation */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {monthlyData.map(([month, data], index) => (
                  <div key={month} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ 
                      minWidth: "80px", 
                      fontSize: "0.875rem", 
                      color: "#64748b",
                      fontWeight: 600 
                    }}>
                      {month}
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{
                        background: "#dbeafe",
                        height: "24px",
                        borderRadius: "4px",
                        width: `${(data.count / Math.max(...monthlyData.map(([, d]) => d.count))) * 100}%`,
                        minWidth: "20px",
                        position: "relative",
                      }} />
                      <div style={{ 
                        fontSize: "0.875rem", 
                        color: "#374151", 
                        fontWeight: 600,
                        minWidth: "60px"
                      }}>
                        {data.count} meetings
                      </div>
                      <div style={{ 
                        fontSize: "0.875rem", 
                        color: "#10b981", 
                        fontWeight: 600 
                      }}>
                        ₹{data.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Breakdown */}
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
                <FiDollarSign style={{ marginRight: "0.5rem" }} />
                Revenue Analytics
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
              }}>
                <div style={{
                  background: "#f8fafc",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b" }}>
                    ₹{revenueStats.average.toLocaleString()}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                    Average Fee
                  </div>
                </div>
                <div style={{
                  background: "#f8fafc",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#10b981" }}>
                    ₹{revenueStats.highest.toLocaleString()}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                    Highest Fee
                  </div>
                </div>
                <div style={{
                  background: "#f8fafc",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3b82f6" }}>
                    ₹{revenueStats.lowest.toLocaleString()}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                    Lowest Fee
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Status Distribution */}
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
                display: "flex",
                alignItems: "center",
              }}>
                <FiPieChart style={{ marginRight: "0.5rem" }} />
                Status Distribution
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {Object.entries(statusDistribution).map(([status, count]) => {
                  const percentage = Math.round((count / meetings.length) * 100);
                  const colors = {
                    upcoming: "#3b82f6",
                    ongoing: "#10b981",
                    completed: "#6b7280",
                    cancelled: "#ef4444"
                  };
                  
                  return (
                    <div key={status} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem",
                      background: "#f8fafc",
                      borderRadius: "8px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: colors[status],
                          marginRight: "0.75rem",
                        }} />
                        <span style={{ 
                          fontSize: "0.875rem", 
                          color: "#374151", 
                          textTransform: "capitalize",
                          fontWeight: 600
                        }}>
                          {status}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                          {count}
                        </span>
                        <span style={{ 
                          fontSize: "0.75rem", 
                          color: "#94a3b8",
                          background: "white",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px"
                        }}>
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
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
                Quick Actions
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button
                  onClick={() => navigate("/schoolemy/schedule-meeting")}
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
                  <FiCalendar style={{ marginRight: "0.5rem" }} />
                  Schedule New Meeting
                </button>

                <button
                  onClick={() => navigate("/schoolemy/view-meetings")}
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
                  <FiUsers style={{ marginRight: "0.5rem" }} />
                  View All Meetings
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
                  Export Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "2rem",
          marginTop: "2rem",
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
            <FiActivity style={{ marginRight: "0.5rem" }} />
            Recent Meetings
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {meetings.slice(0, 5).map((meeting) => (
              <div
                key={meeting._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/schoolemy/meeting-details/${meeting._id}`)}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#374151", marginBottom: "0.25rem" }}>
                    {meeting.meet_title}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                    {meeting.meet_id} • Created {new Date(meeting.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{
                    background: meeting.status === 'completed' ? "#dcfce7" : 
                               meeting.status === 'ongoing' ? "#dbeafe" : "#fef3c7",
                    color: meeting.status === 'completed' ? "#166534" : 
                           meeting.status === 'ongoing' ? "#1e40af" : "#d97706",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}>
                    {meeting.status}
                  </span>
                  <span style={{ fontWeight: 600, color: "#10b981" }}>
                    ₹{meeting.fees.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
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

export default MeetingAnalytics;
