import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const cover = event.coverImages && event.coverImages[0];
  let imgSrc = null;
  try {
    if (cover && cover.contentType && cover.data) {
      // If backend returns base64 string
      if (typeof cover.data === "string") {
        imgSrc = `data:${cover.contentType};base64,${cover.data}`;
      } else if (cover.data && cover.data.data) {
        // If it's a buffer object, convert to base64
        let binary = "";
        const data = cover.data.data;
        for (let i = 0; i < data.length; i++) {
          binary += String.fromCharCode(data[i]);
        }
        const base64 = btoa(binary);
        imgSrc = `data:${cover.contentType};base64,${base64}`;
      }
    }
  } catch (e) {
    console.error("Image decode error:", e);
  }

  return (
    <div
      className="event-card"
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onClick={() => navigate(`${event.eventId || event._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={event.eventName} style={styles.image} />
      ) : (
        <div style={styles.noImage}>No image</div>
      )}
      <div style={styles.content}>
        <h3 style={styles.title}>{event.eventName}</h3>
        <div style={styles.meta}>
          {event.date} • {event.time} • {event.venue?.type}
        </div>
        <div style={styles.description}>
          {(event.description || "").slice(0, 120)}
          {event.description && event.description.length > 120 ? "…" : ""}
        </div>
        <div style={styles.statusContainer}>
          <span style={styles.status}>{event.status}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    gap: "16px",
    cursor: "pointer",
    background: "white",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
  },
  image: {
    width: "120px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
  },
  noImage: {
    width: "120px",
    height: "80px",
    background: "#f8f9fa",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    fontSize: "12px",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: "1.4",
  },
  meta: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  description: {
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.5",
    flex: 1,
  },
  statusContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  status: {
    fontSize: "12px",
    padding: "6px 12px",
    background: "#eef2ff",
    borderRadius: "20px",
    color: "#3730a3",
    fontWeight: "600",
    textTransform: "capitalize",
  },
};

export default EventCard;
