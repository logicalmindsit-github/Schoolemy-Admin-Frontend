import api from "./api";

const EVENT_BASE = "/event";

export const listEvents = (params = {}) =>
  api.get(`${EVENT_BASE}/list`, { params });
export const getEvent = (eventId) =>
  api.get(`${EVENT_BASE}/details/${eventId}`);
export const createEvent = (payload) =>
  api.post(`${EVENT_BASE}/create`, payload);
export const updateEvent = (eventId, payload) =>
  api.put(`${EVENT_BASE}/update/${eventId}`, payload);
export const deleteEvent = (eventId) =>
  api.delete(`${EVENT_BASE}/remove/${eventId}`);
export const getEventsByStatus = (status) =>
  api.get(`${EVENT_BASE}/status/${status}`);

const eventApi = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByStatus,
};

export default eventApi;
