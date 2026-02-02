import React, { useEffect, useState } from "react";
import { createEvent, updateEvent, getEvent } from "../../../Utils/eventApi";
import { useNavigate, useParams } from "react-router-dom";

const toBase64 = (file) =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = (err) => rej(err);
  });

const EventForm = () => {
  const { eventId } = useParams();
  const editMode = Boolean(eventId);
  const [form, setForm] = useState({
    eventName: "",
    category: "",
    date: "",
    time: "",
    venue: { type: "Offline", location: "" },
    description: "",
    status: "Upcoming",
    coverImages: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!editMode) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getEvent(eventId);
        if (res?.data)
          setForm((prev) => ({ ...prev, ...(res.data.data || res.data) }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId, editMode]);

  const onFile = async (e) => {
    const files = Array.from(e.target.files || []);
    const base64List = await Promise.all(files.map((f) => toBase64(f)));
    setForm((f) => ({
      ...f,
      coverImages: [...(f.coverImages || []), ...base64List],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        await updateEvent(eventId, form);
      } else {
        await createEvent(form);
      }
      navigate("../events");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>{editMode ? "Edit Event" : "Create Event"}</h2>
        {loading && <div style={styles.loading}>Loading…</div>}
        <form onSubmit={submit} style={styles.form}>
          <input
            placeholder="Event name"
            value={form.eventName}
            onChange={(e) => setForm({ ...form, eventName: e.target.value })}
            required
            style={styles.input}
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            style={styles.input}
          />
          <div style={styles.dateTimeRow}>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              style={styles.input}
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              required
              style={styles.input}
            />
          </div>
          <select
            value={form.venue?.type}
            onChange={(e) =>
              setForm({
                ...form,
                venue: { ...form.venue, type: e.target.value },
              })
            }
            style={styles.select}
          >
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
          </select>
          <input
            placeholder="Venue location or link"
            value={form.venue?.location}
            onChange={(e) =>
              setForm({
                ...form,
                venue: { ...form.venue, location: e.target.value },
              })
            }
            style={styles.input}
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            style={styles.select}
          >
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
          </select>
          <textarea
            placeholder="Description"
            rows={6}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={styles.textarea}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onFile}
            style={styles.fileInput}
          />
          <div style={styles.imagePreview}>
            {(form.coverImages || []).map((img, idx) => (
              <div key={idx} style={styles.imageContainer}>
                <img src={img} alt="" style={styles.previewImage} />
              </div>
            ))}
          </div>

          <div style={styles.buttonRow}>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
            >
              {editMode ? "Save" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
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
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: "-0.5px",
    marginBottom: "32px",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    color: "#666",
    background: "#f8f9fa",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gap: "20px",
    maxWidth: "800px",
    background: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "16px",
    background: "#ffffff",
    transition: "border-color 0.3s ease",
    outline: "none",
  },
  select: {
    padding: "12px 16px",
    border: "1px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "16px",
    background: "#ffffff",
    cursor: "pointer",
    outline: "none",
  },
  textarea: {
    padding: "12px 16px",
    border: "1px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "16px",
    background: "#ffffff",
    resize: "vertical",
    minHeight: "120px",
    outline: "none",
  },
  fileInput: {
    padding: "12px 16px",
    border: "1px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "16px",
    background: "#ffffff",
    cursor: "pointer",
  },
  dateTimeRow: {
    display: "flex",
    gap: "16px",
  },
  imagePreview: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "80px",
    height: "60px",
    overflow: "hidden",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#f8f9fa",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-start",
  },
  submitButton: {
    padding: "12px 24px",
    background: "#667eea",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
  },
  cancelButton: {
    padding: "12px 24px",
    background: "#6c757d",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(108, 117, 125, 0.3)",
    transition: "all 0.3s ease",
  },
};

export default EventForm;
