import api from './api';

export const authService = {
  async register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('recallc_token');
      localStorage.removeItem('recallc_user');
    }
  },

  async getProfile() {
    const res = await api.get('/users/profile');
    return res.data;
  },

  async updateProfile(name) {
    const res = await api.put('/users/profile', { name });
    return res.data;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await api.put('/users/change-password', { currentPassword, newPassword });
    return res;
  }
};

