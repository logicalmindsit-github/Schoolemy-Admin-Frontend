import React, { useEffect, useState } from "react";
import axios from "../../../../Utils/api";
import { FaChartLine, FaFolderOpen, FaArrowLeft } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

// Generate dynamic gradient header color using HSL
const getDynamicColor = (index) => {
  const hue = (index * 57) % 360;
  return `linear-gradient(to right, hsl(${hue}, 70%, 50%), hsl(${
    (hue + 30) % 360
  }, 70%, 60%))`;
};

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        // Use the token-backed route that returns the tutor's courses
        // axios instance already attaches token via interceptor
        const response = await axios.get("/courses-tutors");

        // Controller may return different shapes:
        // - old getCourseNames: array directly in response.data
        // - new /courses-tutors/me: { success, count, data: [courses...] }
        const payload = response.data && response.data.data ? response.data.data : response.data;
        setCourses(payload || []);
      } catch (err) {
        console.error("Fetch courses error:", err?.response || err?.message || err);

        if (err?.response) {
          const status = err.response.status;
          const serverMsg = err.response.data?.message || err.response.data?.error || JSON.stringify(err.response.data);
          console.debug("Courses fetch response error:", status, serverMsg);

          if (status === 401 || status === 403) {
            // Token invalid or expired: clear token and redirect to login
            localStorage.removeItem("token");
            setError("Session expired or unauthorized. Redirecting to login...");
            setTimeout(() => navigate("/login"), 700);
          } else if (status === 404) {
            // No courses found for tutor — show empty-state instead of error
            setCourses([]);
            setError("");
          } else {
            setError(serverMsg || "Failed to fetch courses. Server error.");
          }
        } else {
          console.debug("Courses fetch network/error:", err.message || err);
          setError("Network error: please check the server or your internet connection.");
        }
      }
    };

    fetchCourses();
  }, [navigate]);

  if (navigating) {
  return (
    <div style={{
      textAlign: "center",
      marginTop: "100px",
      fontSize: "18px",
      color: "#3498db"
    }}>
      Loading course details...
    </div>
  );
}

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          backgroundColor: "#f8f9fa",
          border: "none",
          borderRadius: "8px",
          color: "#2c3e50",
          cursor: "pointer",
          marginBottom: "20px",
          transition: "all 0.3s ease",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#e9ecef";
          e.currentTarget.style.transform = "translateX(-4px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
          e.currentTarget.style.transform = "translateX(0)";
        }}
      >
        <FaArrowLeft /> Back
      </button>

      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "28px",
          color: "#2c3e50",
        }}
      >
        Courses - List
      </h2>

      {/* Show friendly message when there are no courses for the tutor */}
      {courses.length === 0 && !error && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            margin: "20px auto",
            background: "#f8fafc",
            border: "1px solid #e6edf3",
            borderRadius: "10px",
            color: "#475569",
            maxWidth: "720px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "20px", marginBottom: "8px" }}>
            No courses for you
          </h3>
          <p style={{ margin: 0, color: "#64748b" }}>
            You don't have any courses yet. Create your first course or check back later.
          </p>
        </div>
      )}

      {error && (
        <p
          style={{
            color: "#e74c3c",
            backgroundColor: "#f9d6d5",
            padding: "10px",
            borderRadius: "6px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {courses.map((course, index) => (
          <div
            key={course._id}
            onClick={() => {
              setNavigating(true);
              navigate(
                `/schoolemy/tutor-course-list/${encodeURIComponent(course.coursename)}`
              );
            }}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: "220px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                background: getDynamicColor(index),
                padding: "16px",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                minHeight: "60px",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                  }}
                >
                  {course.coursename}
                </h3>
              </div>
              <BsThreeDotsVertical size={16} />
            </div>

            <div style={{ flex: 1, padding: "10px 16px" }}></div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "10px 16px",
                gap: "10px",
                borderTop: "1px solid #eee",
              }}
            >
              <FaChartLine style={{ cursor: "pointer", color: "#7f8c8d" }} />
              <FaFolderOpen style={{ cursor: "pointer", color: "#7f8c8d" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
