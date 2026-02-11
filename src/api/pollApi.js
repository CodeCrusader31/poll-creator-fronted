// src/api/pollApi.js
import axios from "axios";



const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default API;

// Create Poll
export const createPoll = (data) => API.post("/polls", data);

// Get Poll (with results)
export const getPoll = (pollId) => API.get(`/polls/${pollId}`);

// Submit Vote
export const submitVote = (pollId, data) =>
  API.post(`/polls/${pollId}/vote`, data);

// Close Poll
export const closePoll = (pollId) =>
  API.post(`/polls/${pollId}/close`);
