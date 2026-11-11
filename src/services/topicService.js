import api from './api';

export const topicService = {
  async getTopics(params = {}) {
    const res = await api.get('/topics', { params });
    return res;
  },

  async getTopic(id) {
    const res = await api.get(`/topics/${id}`);
    return res.data;
  },

  async createTopic(topicData) {
    const res = await api.post('/topics', topicData);
    return res.data;
  },

  async updateTopic(id, topicData) {
    const res = await api.put(`/topics/${id}`, topicData);
    return res.data;
  },

  async deleteTopic(id) {
    const res = await api.delete(`/topics/${id}`);
    return res;
  }
};

