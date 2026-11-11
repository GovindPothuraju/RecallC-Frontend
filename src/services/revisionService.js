import api from './api';

export const revisionService = {
  async getDueToday() {
    const res = await api.get('/revisions/today');
    return res.data;
  },

  async getOverdue() {
    const res = await api.get('/revisions/overdue');
    return res.data;
  },

  async getRevision(id) {
    const res = await api.get(`/revisions/${id}`);
    return res.data;
  },

  async completeRevision(id, completionData) {
    const res = await api.post(`/revisions/${id}/complete`, completionData);
    return res.data;
  },

  async getRevisions(params = {}) {
    const res = await api.get('/revisions', { params });
    return res;
  }
};

