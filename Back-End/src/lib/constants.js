const ALLOWED_TYPES = ['income', 'expense'];

const DEFAULT_CATEGORIES = [
  { name: 'Gaji', type: 'income', icon: 'Briefcase', color: '#10b981' },
  { name: 'Freelance', type: 'income', icon: 'Laptop', color: '#3b82f6' },
  { name: 'Investasi', type: 'income', icon: 'TrendingUp', color: '#8b5cf6' },
  { name: 'Hadiah', type: 'income', icon: 'Gift', color: '#f59e0b' },
  { name: 'Makanan', type: 'expense', icon: 'UtensilsCrossed', color: '#ef4444' },
  { name: 'Transportasi', type: 'expense', icon: 'Car', color: '#8b5cf6' },
  { name: 'Belanja', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
  { name: 'Tagihan', type: 'expense', icon: 'Receipt', color: '#f97316' },
  { name: 'Hiburan', type: 'expense', icon: 'Gamepad2', color: '#06b6d4' },
  { name: 'Kesehatan', type: 'expense', icon: 'Heart', color: '#ef4444' },
  { name: 'Pendidikan', type: 'expense', icon: 'GraduationCap', color: '#3b82f6' },
  { name: 'Rumah', type: 'expense', icon: 'Home', color: '#14b8a6' },
];

const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { ALLOWED_TYPES, DEFAULT_CATEGORIES, getPagination };
