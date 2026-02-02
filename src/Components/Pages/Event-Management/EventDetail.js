import React, { useEffect, useState } from "react";
import { getEvent, deleteEvent } from "../../../Utils/eventApi";
import { useParams, useNavigate } from "react-router-dom";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getEvent(eventId);
        if (res?.data) setEvent(res.data.data || res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(eventId);
      navigate("..");
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    }
  };

  if (loading) return <div style={styles.loading}>Loading…</div>;
  if (!event) return <div style={styles.error}>Event not found</div>;

  const cover = event.coverImages && event.coverImages[0];
  let imgSrc = null;
  try {
    if (cover && cover.contentType && cover.data) {
      if (typeof cover.data === "string")
        imgSrc = `data:${cover.contentType};base64,${cover.data}`;
      else if (cover.data && cover.data.data) {
        let binary = "";
        const data = cover.data.data;
        for (let i = 0; i < data.length; i++) {
          binary += String.fromCharCode(data[i]);
        }
        const base64 = btoa(binary);
        imgSrc = `data:${cover.contentType};base64,${base64}`;
      }
    }
  } catch (e) {}

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h2 style={styles.title}>{event.eventName}</h2>
          <div style={styles.actions}>
            <button
              onClick={() => navigate(`edit/${event.eventId || event._id}`)}
              style={styles.editButton}
            >
              Edit
            </button>
            <button onClick={handleDelete} style={styles.deleteButton}>
              Delete
            </button>
          </div>
        </div>

        {imgSrc && <img src={imgSrc} alt="" style={styles.coverImage} />}

        <div style={styles.details}>
          <div style={styles.detailItem}>
            <strong style={styles.label}>Status:</strong>
            <span style={styles.status}>{event.status}</span>
          </div>
          <div style={styles.detailItem}>
            <strong style={styles.label}>Date:</strong> {event.date}{" "}
            {event.time}
          </div>
          <div style={styles.detailItem}>
            <strong style={styles.label}>Venue:</strong> {event.venue?.type}{" "}
            {event.venue?.location}
          </div>
          <div style={styles.description}>{event.description}</div>
          {event.goal && (
            <div style={styles.detailItem}>
              <strong style={styles.label}>Goal:</strong> {event.goal}
            </div>
          )}
          {event.organizer && (
            <div style={styles.detailItem}>
              <strong style={styles.label}>Organizer:</strong> {event.organizer}
            </div>
          )}
          {event.contactEmail && (
            <div style={styles.detailItem}>
              <strong style={styles.label}>Contact:</strong>{" "}
              {event.contactEmail}
            </div>
          )}
        </div>
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
    maxWidth: "900px",
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
  actions: {
    display: "flex",
    gap: "12px",
  },
  editButton: {
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
  deleteButton: {
    padding: "10px 20px",
    background: "#dc3545",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(220, 53, 69, 0.3)",
    transition: "all 0.3s ease",
  },
  coverImage: {
    maxWidth: "100%",
    width: "100%",
    borderRadius: "12px",
    marginBottom: "32px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  details: {
    background: "white",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
  },
  detailItem: {
    marginBottom: "16px",
    fontSize: "16px",
    lineHeight: "1.5",
  },
  label: {
    color: "#1a1a1a",
    fontWeight: "600",
    marginRight: "8px",
  },
  status: {
    display: "inline-block",
    padding: "4px 12px",
    background: "#eef2ff",
    borderRadius: "20px",
    color: "#3730a3",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  description: {
    marginTop: "24px",
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#333",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    color: "#666",
    background: "#f8f9fa",
    borderRadius: "12px",
  },
  error: {
    textAlign: "center",
    padding: "60px",
    fontSize: "18px",
    color: "#dc3545",
    background: "#f8f9fa",
    borderRadius: "12px",
  },
};

export default EventDetail;
