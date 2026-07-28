const API_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api')).replace(/\/api\/?$/, '');

export const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  return `${API_BASE}${avatar}`;
};

export default API_BASE;
