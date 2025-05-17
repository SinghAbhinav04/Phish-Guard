import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Scan URL for phishing
export const scanUrl = async (url) => {
  try {
    const response = await api.post('/scan', { url })
    return response.data
  } catch (error) {
    console.error('Error scanning URL:', error)
    throw error
  }
}

// Get browsing history
export const getHistory = async () => {
  try {
    const response = await api.get('/history')
    return response.data
  } catch (error) {
    console.error('Error fetching history:', error)
    throw error
  }
}

// Submit feedback
export const submitFeedback = async (url, userFeedback, type) => {
  try {
    const response = await api.post('/feedback', { url, userFeedback, type })
    return response.data
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}