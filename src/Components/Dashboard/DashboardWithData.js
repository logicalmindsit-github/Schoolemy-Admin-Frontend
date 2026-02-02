import React, { useState, useEffect } from "react";
import DashboardContent from "./DashboardContent";
import { Spin } from "antd";
import axios from "../../Utils/api";

/**
 * DashboardWithData - A wrapper component that fetches dashboard data and passes it as props to DashboardContent
 * This component handles all the API calls and data processing, keeping DashboardContent as a pure presentation component
 * 
 * APIs used:
 * - /getallusers - Fetches total user count (no auth required)
 * - /getcoursesname - Fetches course list to count total courses (requires Bearer token)
 */
const DashboardWithData = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 1520,
    totalCourses: 0,
    activeSubscriptions: 1245,
    completionRate: 86,
    loading: false
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true }));
    
    try {
      // Get token for course API call
      const token = localStorage.getItem("token");
      
      // Fetch users data
      const usersResponse = await axios.get("/getallusers");
      const totalUsers = usersResponse.data.data?.length || 1520;

      // Fetch courses data
      let totalCourses = 0; // Default fallback
      if (token) {
        try {
          const coursesResponse = await axios.get("/api/courses/getcoursesname", {
            headers: { Authorization: `Bearer ${token}` },
          });
          totalCourses = coursesResponse.data?.length || 0;
        } catch (courseError) {
          console.warn("Failed to fetch courses, using default value:", courseError);
        }
      }

      // You can add more API calls here for other metrics
      // const subscriptionsResponse = await axios.get("/api/subscriptions");
      
      setDashboardData({
        totalUsers,
        totalCourses, // Now using actual API data
        activeSubscriptions: 1245, // Replace with actual API call when available
        completionRate: 86, // Replace with actual API call when available
        loading: false
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Keep default values on error
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  if (dashboardData.loading) {
  return (
      <div style={styles.loadingContainer}>
        <Spin size="large" tip="Loading proposals..." />
      </div>
    );
  }


  return (
    <DashboardContent
      totalUsers={dashboardData.totalUsers}
      totalCourses={dashboardData.totalCourses}
      activeSubscriptions={dashboardData.activeSubscriptions}
      completionRate={dashboardData.completionRate}
    />
  );
};

const styles = {
    loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
}
export default DashboardWithData;
