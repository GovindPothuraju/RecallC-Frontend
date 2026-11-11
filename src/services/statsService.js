import api from './api';

export const statsService = {
  async getDashboardSummary() {
    const res = await api.get('/dashboard/summary');
    return res.data;
  },

  async getProgressSummary() {
    const res = await api.get('/progress/summary');
    return res.data;
  },

  async getRevisionHistory(params = {}) {
    const res = await api.get('/progress/history', { params });
    return res;
  }
};

