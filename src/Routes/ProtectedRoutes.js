import React from "react";
import { hasAccess, getRoleDisplayName } from "../Utils/roleBasedAccess";
import { secureStorage } from "../Utils/security";

/**
 * Route protection configuration with role-based access control
 * Mirrors the menu items structure from LayoutHeaderSidebar
 */
export const routeAccessConfig = {
  // Dashboard and Main Routes
  dashboard: {
    path: "/",
    roles: [
      "superadmin",
      "admin",
      "committeeoftrustees",
      "boscontroller",
      "bosmembers",
      "coursemanagement",
      "tutormanagement",
      "usermanagement",
      "documentverification",
      "marketing",
      "auditor",
      "Financial",
    ],
  },

  // Admin/COT Routes
  "admin-users": {
    path: "admin-users",
    roles: ["superadmin", "admin", "committeeoftrustees"],
  },
  "create-admin": {
    path: "create-admin",
    roles: ["superadmin", "admin", "committeeoftrustees"],
  },
  "admin-details": {
    path: "admin-details",
    roles: ["superadmin", "admin", "committeeoftrustees"],
  },
  "admin-analytics": {
    path: "admin-analytics",
    roles: ["superadmin", "admin", "committeeoftrustees"],
  },
  "create-tutors": {
    path: "create-tutors",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement"],
  },
  "tutor-details": {
    path: "tutor-details",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement"],
  },
  "tutor-analytics": {
    path: "tutor-analytics",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement"],
  },

  // User Routes
  users: {
    path: "users",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "user-details": {
    path: "user-details",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "Payment-record": {
    path: "Payment-record",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement","auditor"],
  },
  "emi-details": {
    path: "emi-details",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "login-status": {
    path: "login-status",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "student-documents": {
    path: "student-documents",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },

  // Course Routes
  courses: {
    path: "courses",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },
  "add-course": {
    path: "add-course",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },
  "course-list": {
    path: "course-list",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },
  "course-details": {
    path: "course-list/:coursename",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },
  "edit-course": {
    path: "edit-course/:coursename",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },
  "view-courses-by-category": {
    path: "view-courses-by-category",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },

  // Question Paper Routes
  "add-question-paper": {
    path: "add-question-paper",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },
  "view-question-papers": {
    path: "view-question-papers",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },

  // Exam Answer Management Routes
  "exam-answers": {
    path: "exam-answers",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },
  "exam-dashboard": {
    path: "exam-dashboard",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },
  "student-stats": {
    path: "student-stats",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },
  "course-analytics": {
    path: "course-analytics",
    roles: ["superadmin", "admin", "committeeoftrustees", "coursemanagement"],
  },

  // BOS Routes
  bos: {
    path: "bos",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "bos-members": {
    path: "bos-members",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "create-meeting": {
    path: "create-meeting",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "submit-course-proposal": {
    path: "submit-course-proposal",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "pending-proposals": {
    path: "pending-proposals",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "create-decision": {
    path: "create-decision",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "recent-decision": {
    path: "recent-decision",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "create-bos-meeting": {
    path: "create-bos-meeting",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "view-bos-meeting": {
    path: "view-bos-meeting",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "assign-task": {
    path: "assign-task",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "task-status": {
    path: "task-status",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },

  // Data Maintenance Routes
  "data-maintenance": {
    path: "data-maintenance",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "direct-meet-fees": {
    path: "direct-meet-fees",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "monthly-fees": {
    path: "monthly-fees",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "meet-materials": {
    path: "meet-materials",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "completion-certificates": {
    path: "completion-certificates",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "participant-certificates": {
    path: "participant-certificates",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "exam-marks-records": {
    path: "exam-marks-records",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "staff-management": {
    path: "staff-management",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "student-complaints": {
    path: "student-complaints",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "student-details-management": {
    path: "student-details-management",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "practice-class-list": {
    path: "practice-class-list",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "practice-class-list-detail": {
    path: "practice-class-list/:courseName",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
   "Financial": {
    path: "Financial",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement","Financial"],
  },

  // DirectMeet Management Routes
  "direct-meet-management": {
    path: "direct-meet-management",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "schedule-meeting": {
    path: "schedule-meeting",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "view-meetings": {
    path: "view-meetings",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "edit-meeting": {
    path: "edit-meeting/:id",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "meeting-details": {
    path: "meeting-details/:id",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "meeting-analytics": {
    path: "meeting-analytics",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "manage-participants": {
    path: "manage-participants",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },
  "meeting-fees": {
    path: "meeting-fees",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },

  // Institutional Board Routes
  "institutional-board": {
    path: "institutional-board",
    roles: ["superadmin", "admin", "committeeoftrustees"],
  },

  // Marketing Routes
  "marketing-dashboard": {
    path: "marketing-dashboard",
    roles: ["superadmin", "admin", "committeeoftrustees", "marketing"],
  },
  "marketing-create-announcement": {
    path: "marketing/create-announcement",
    roles: ["superadmin", "admin", "committeeoftrustees", "marketing"],
  },
  "marketing-create-advertisement": {
    path: "marketing/create-advertisement",
    roles: ["superadmin", "admin", "committeeoftrustees", "marketing"],
  },
  "marketing-create-notification": {
    path: "marketing/create-notification",
    roles: ["superadmin", "admin", "committeeoftrustees", "marketing"],
  },

  // Document Verification Routes
  "document-verification": {
    path: "document-verification",
    roles: ["superadmin", "admin", "committeeoftrustees", "documentverification"],
  },

  // Certificate Maintenance Routes
  "certificate-maintenance": {
    path: "certificate-maintenance",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },

  // Voting Routes
  "vote-demo": {
    path: "demo",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  vote: {
    path: "vote",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "vote-create": {
    path: "create",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  polling: {
    path: "polling",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  results: {
    path: "results",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  total: {
    path: "total",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },
  "live-results": {
    path: "live-results",
    roles: ["superadmin", "admin", "committeeoftrustees", "boscontroller",
      "bosmembers",],
  },

  // Notification Routes
  notifications: {
    path: "notifications",
    roles: [
      "superadmin",
      "admin",
      "committeeoftrustees",
      "boscontroller",
      "bosmembers",
      "coursemanagement",
      "tutormanagement",
      "usermanagement",
      "documentverification",
      "marketing",
      "auditor",
    ],
  },

  // Profile Routes
  profile: {
    path: "profile",
    roles: [
      "superadmin",
      "admin",
      "committeeoftrustees",
      "boscontroller",
      "bosmembers",
      "coursemanagement",
      "tutormanagement",
      "usermanagement",
      "documentverification",
      "marketing",
      "auditor",
      "tutor",
      "Financial",
    ],
  },

  // Feedback Routes
  feedback: {
    path: "feedback",
    roles: ["superadmin", "admin", "committeeoftrustees", "usermanagement"],
  },

  // Tutor Routes
  "tutor-terms-and-conditions": {
    path: "tutor-terms-and-conditions",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement", "tutor"],
  },
  "tutor-dashboard": {
    path: "tutor/dashboard",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement", "tutor"],
  },
  "tutors-management": {
    path: "tutors-management",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement"],
  },
  "tutor-upload-course": {
    path: "tutor-upload-course",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutor","tutormanagement"],
  },
  "tutor-course-list": {
    path: "tutor-course-list",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement", "tutor"],
  },
  "tutor-course-details": {
    path: "tutor-course-list/:coursename",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement", "tutor"],
  },
  "tutor-edit-course": {
    path: "tutor-edit-course/:coursename",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement", "tutor"],
  },

  // PCM Routes
  "pcm-dashboard": {
    path: "pcm-dashboard",
    roles: [
      "superadmin",
      "admin",
      "committeeoftrustees",
     "boscontroller",
      "bosmembers",
      "coursemanagement",
      "tutormanagement",
      "usermanagement",
      "marketing",
    ],
  },
  "create-pcm-class": {
    path: "create-pcm-class",
    roles: [
      "superadmin",
      "admin",
      "committeeoftrustees",
      "coursemanagement",
    ],
  },
  "pcm-class-details": {
    path: "pcm-class-details",
    roles: [
      "superadmin",
      "admin",
      "committeeoftrustees",
      "coursemanagement",
    ],
  },

  // Blog Routes
  "blog-management": {
    path: "blog-management",
    roles: ["superadmin", "admin", "committeeoftrustees", "marketing"],
  },
  blogs: {
    path: "blogs",
    roles: [
      "superadmin",
      "admin",
      "committeeoftrustees",
      "boscontroller",
      "bosmembers",
      "coursemanagement",
      "tutormanagement",
      "usermanagement",
      "marketing",
      "tutor",
    ],
  },

  //tutor dashboard
  "tutor-data-management": {
    path: "tutor-data-management",
    roles: ["superadmin", "admin", "committeeoftrustees", "tutormanagement"],
  },

  // Financial Management Routes
  "financial-auditing": {
    path: "financial-auditing",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
  "donation-new": {
    path: "donation/new",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
  "donation-edit": {
    path: "donation/edit/:donationId",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
  "donation-detail": {
    path: "donation/:donationId",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
  "expense-new": {
    path: "expense/new",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
  "expense-edit": {
    path: "expense/edit/:expenseId",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
  "expense-detail": {
    path: "expense/:expenseId",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
    "direct-meet-fees-AUD": {
    path: "direct-meet-fees-AUD",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
  "monthly-fees-AUD": {
    path: "monthly-fees-AUD",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
  "payment-records-AUD": {
    path: "payment-records-AUD",
    roles: ["superadmin", "admin", "committeeoftrustees", "auditor"],
  },
};

/**
 * Check if a user role has access to a route
 * @param {string} role - User's role
 * @param {string} routeKey - Route key from routeAccessConfig
 * @returns {boolean} - Whether user has access
 */
export const canAccessRoute = (role, routeKey) => {
  const routeConfig = routeAccessConfig[routeKey];
  if (!routeConfig) return false;
  return hasAccess(role, routeConfig.roles);
};

/**
 * Get all accessible routes for a role
 * @param {string} role - User's role
 * @returns {Object} - Object with accessible route keys
 */
export const getAccessibleRoutes = (role) => {
  const accessible = {};
  Object.entries(routeAccessConfig).forEach(([key, config]) => {
    if (hasAccess(role, config.roles)) {
      accessible[key] = config;
    }
  });
  return accessible;
};

/**
 * Protected Route Component - Wraps a route to enforce role-based access
 * Usage: <ProtectedRoute element={<MyComponent />} routeKey="course-list" />
 */
export const ProtectedRoute = ({ element, routeKey }) => {
  // Use secure storage to get role
  const role = secureStorage.getItem("role");

  if (!canAccessRoute(role, routeKey)) {
    return <AccessDeniedFallback routeKey={routeKey} userRole={role} />;
  }

  return element;
};

/**
 * Access Denied Fallback Component
 */
export const AccessDeniedFallback = ({ routeKey, userRole }) => {
  const routeConfig = routeAccessConfig[routeKey];
  const allowedRoles = routeConfig?.roles || [];

  return (
    <div
      style={{
        padding: "3rem 2rem",
        textAlign: "center",
        color: "#ef4444",
        fontSize: "1.2rem",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <h2
          style={{ fontSize: "2rem", marginBottom: "1rem", color: "#dc2626" }}
        >
          Access Denied
        </h2>
        <p
          style={{ fontSize: "1rem", marginBottom: "1.5rem", color: "#6b7280" }}
        >
          You don't have permission to access this page.
        </p>
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
            border: "1px solid #fee2e2",
          }}
        >
          <p
            style={{
              color: "#991b1b",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            <strong>Required roles:</strong>
          </p>
          <p style={{ color: "#7f1d1d", fontSize: "0.85rem" }}>
            {allowedRoles.map((r) => getRoleDisplayName(r)).join(", ")}
          </p>
          <p
            style={{
              color: "#7f1d1d",
              fontSize: "0.85rem",
              marginTop: "0.5rem",
              borderTop: "1px solid #fecaca",
              paddingTop: "0.5rem",
            }}
          >
            <strong>Your role:</strong> {getRoleDisplayName(userRole)}
          </p>
        </div>
        <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
