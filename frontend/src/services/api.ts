import axios from 'axios';

// Ensure the URL always ends with /api correctly
const getBaseUrl = () => {
  // Use 5001 as per recent project overhaul
  let url = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
  if (!url.endsWith('/api')) {
    url = `${url.trim().replace(/\/$/, '')}/api`;
  }
  return url;
};

const API_URL = getBaseUrl();

console.log('✅ Final API URL:', API_URL);

export const fetchAnalyticsStats = async () => {
  const response = await axios.get(`${API_URL}/analytics/stats`);
  return response.data;
};

export const fetchPrediction = async () => {
  const response = await axios.get(`${API_URL}/analytics/prediction`);
  return response.data;
};

export const fetchHeatmap = async () => {
  const response = await axios.get(`${API_URL}/analytics/heatmap`);
  return response.data;
};

export const fetchWaitingTimes = async () => {
  const response = await axios.get(`${API_URL}/analytics/waiting-times`);
  return response.data;
};

export const fetchEmergencyHistory = async () => {
  const response = await axios.get(`${API_URL}/emergency/history`);
  return response.data;
};
