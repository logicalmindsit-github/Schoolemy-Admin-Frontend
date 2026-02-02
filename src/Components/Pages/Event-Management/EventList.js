import React, { useEffect, useState } from "react";
import { listEvents } from "../../../Utils/eventApi";
import EventCard from "./EventCard";
import EventFilters from "./EventFilters";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const fetch = async (page = 1, limit = 10, filtersArg = filters) => {
    setLoading(true);
    try {
      const params = { page, limit, ...filtersArg };
      const res = await listEvents(params);
      if (res?.data) {
        // adapt to your backend shape
        const data = res.data.data || res.data.events || [];
        setEvents(data);
        const pag = res.data.pagination || {
          page,
          limit,
          total: res.data.count || data.length,
        };
        setPagination({
          page: pag.page || page,
          limit: pag.limit || limit,
          total: pag.total || data.length,
        });
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error("fetch events", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(1, pagination.limit, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h2 style={styles.title}>Events</h2>
          <div>
            <button
              onClick={() => navigate("create")}
              style={styles.createButton}
            >
              Create event
            </button>
          </div>
        </div>

        <EventFilters filters={filters} setFilters={setFilters} />

        {loading ? (
          <div style={styles.loading}>Loading…</div>
        ) : (
          <>
            <div style={styles.eventsGrid}>
              {events.length === 0 ? (
                <div style={styles.noEvents}>No events found</div>
              ) : (
                events.map((ev) => (
                  <EventCard key={ev.eventId || ev._id} event={ev} />
                ))
              )}
            </div>

            <div style={styles.pagination}>
              <button
                disabled={pagination.page <= 1}
                onClick={() =>
                  fetch(Math.max(1, pagination.page - 1), pagination.limit)
                }
                style={{
                  ...styles.pageButton,
                  ...(pagination.page <= 1 ? styles.pageButtonDisabled : {}),
                }}
              >
                Prev
              </button>
              <div style={styles.pageInfo}>
                Page {pagination.page} of{" "}
                {Math.max(
                  1,
                  Math.ceil((pagination.total || 0) / (pagination.limit || 1))
                )}
              </div>
              <button
                disabled={
                  pagination.page >=
                  Math.ceil((pagination.total || 0) / (pagination.limit || 1))
                }
                onClick={() => fetch(pagination.page + 1, pagination.limit)}
                style={{
                  ...styles.pageButton,
                  ...(pagination.page >=
                  Math.ceil((pagination.total || 0) / (pagination.limit || 1))
                    ? styles.pageButtonDisabled
                    : {}),
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#ffffff",
    padding: "40px 20px",
  },
  wrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    margin: "0",
    fontSize: "36px",
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: "-0.5px",
  },
  createButton: {
    padding: "12px 24px",
    background: "#667eea",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    color: "#666",
    background: "#f8f9fa",
    borderRadius: "12px",
  },
  eventsGrid: {
    display: "grid",
    gap: "20px",
    marginBottom: "40px",
  },
  noEvents: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    color: "#666",
    background: "#f8f9fa",
    borderRadius: "12px",
  },
  pagination: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  pageButton: {
    padding: "10px 20px",
    background: "#667eea",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
  },
  pageButtonDisabled: {
    background: "#e9ecef",
    color: "#6c757d",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500",
  },
};

export default EventList;
