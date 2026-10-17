const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper for making typed JSON requests with consistent error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkError = new Error('Network error: Unable to connect to the server. Please check your connection.');
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

export const api = {
  // Papers
  getPapers: (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });

    const queryString = query.toString();
    return request(`/papers${queryString ? `?${queryString}` : ''}`);
  },

  getPaperById: (id) => request(`/papers/${id}`),

  getPaperByPaperId: (paperId) => request(`/papers/by-paper-id/${encodeURIComponent(paperId)}`),

  createPaper: (paperData) =>
    request('/papers', {
      method: 'POST',
      body: JSON.stringify(paperData),
    }),

  updatePaper: (id, paperData) =>
    request(`/papers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paperData),
    }),

  deletePaper: (id) =>
    request(`/papers/${id}`, {
      method: 'DELETE',
    }),

  checkHealth: () => request('/health'),
};

export default api;
