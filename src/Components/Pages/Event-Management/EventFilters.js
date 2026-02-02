import React from "react";

const EventFilters = ({ filters, setFilters }) => {
  return (
    <div style={styles.container}>
      <select
        value={filters.status || ""}
        onChange={(e) =>
          setFilters({ ...filters, status: e.target.value || undefined })
        }
        style={styles.select}
      >
        <option value="">All status</option>
        <option value="Upcoming">Upcoming</option>
        <option value="Ongoing">Ongoing</option>
        <option value="Completed">Completed</option>
      </select>

      <input
        placeholder="Category"
        value={filters.category || ""}
        onChange={(e) =>
          setFilters({ ...filters, category: e.target.value || undefined })
        }
        style={styles.input}
      />

      <input
        placeholder="Search title"
        value={filters.search || ""}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value || undefined })
        }
        style={styles.input}
      />

      <button onClick={() => setFilters({})} style={styles.resetButton}>
        Reset
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    padding: "20px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f0f0f0",
  },
  select: {
    padding: "10px 14px",
    border: "1px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#ffffff",
    cursor: "pointer",
    outline: "none",
    minWidth: "120px",
  },
  input: {
    padding: "10px 14px",
    border: "1px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "14px",
    background: "#ffffff",
    outline: "none",
    minWidth: "150px",
  },
  resetButton: {
    padding: "10px 20px",
    background: "#6c757d",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(108, 117, 125, 0.3)",
    transition: "all 0.3s ease",
  },
};

export default EventFilters;
