export const defaultUser = {
  id: '1',
  name: 'Difa',
  email: 'difa@email.com',
  password: 'password123'
};

export const defaultCategories = [
  { id: 'cat-1', userId: '1', name: 'Gaji', icon: 'Briefcase', type: 'income', color: '#10b981' },
  { id: 'cat-2', userId: '1', name: 'Freelance', icon: 'Laptop', type: 'income', color: '#3b82f6' },
  { id: 'cat-3', userId: '1', name: 'Makanan', icon: 'UtensilsCrossed', type: 'expense', color: '#f59e0b' },
  { id: 'cat-4', userId: '1', name: 'Transport', icon: 'Car', type: 'expense', color: '#8b5cf6' },
  { id: 'cat-5', userId: '1', name: 'Belanja', icon: 'ShoppingBag', type: 'expense', color: '#ec4899' },
  { id: 'cat-6', userId: '1', name: 'Tagihan', icon: 'Receipt', type: 'expense', color: '#ef4444' },
  { id: 'cat-7', userId: '1', name: 'Hiburan', icon: 'Gamepad2', type: 'expense', color: '#06b6d4' },
  { id: 'cat-8', userId: '1', name: 'Investasi', icon: 'TrendingUp', type: 'income', color: '#22d3ee' }
];

export const defaultTransactions = [
  // Juni 2026
  { id: 't-1', userId: '1', categoryId: 'cat-1', type: 'income', amount: 5000000, note: 'Gaji Bulanan Utama', date: '2026-06-25' },
  { id: 't-2', userId: '1', categoryId: 'cat-3', type: 'expense', amount: 35000, note: 'Nasi Goreng Spesial', date: '2026-06-24' },
  { id: 't-3', userId: '1', categoryId: 'cat-4', type: 'expense', amount: 150000, note: 'Isi Bensin Mobil', date: '2026-06-23' },
  { id: 't-4', userId: '1', categoryId: 'cat-2', type: 'income', amount: 1200000, note: 'Projek Landing Page Client', date: '2026-06-20' },
  { id: 't-5', userId: '1', categoryId: 'cat-5', type: 'expense', amount: 450000, note: 'Beli Baju Kemeja Baru', date: '2026-06-18' },
  { id: 't-6', userId: '1', categoryId: 'cat-6', type: 'expense', amount: 350000, note: 'Tagihan Listrik & Wifi', date: '2026-06-15' },
  { id: 't-7', userId: '1', categoryId: 'cat-3', type: 'expense', amount: 85000, note: 'Makan Siang bareng Temen Kantor', date: '2026-06-12' },
  { id: 't-8', userId: '1', categoryId: 'cat-7', type: 'expense', amount: 120000, note: 'Beli Tiket Bioskop & Popcorn', date: '2026-06-10' },
  { id: 't-9', userId: '1', categoryId: 'cat-8', type: 'income', amount: 300000, note: 'Dividen Reksa Dana Saham', date: '2026-06-05' },

  // Mei 2026
  { id: 't-10', userId: '1', categoryId: 'cat-1', type: 'income', amount: 5000000, note: 'Gaji Bulanan Utama', date: '2026-05-25' },
  { id: 't-11', userId: '1', categoryId: 'cat-3', type: 'expense', amount: 45000, note: 'Beli Kopi & Roti', date: '2026-05-23' },
  { id: 't-12', userId: '1', categoryId: 'cat-4', type: 'expense', amount: 50000, note: 'Top up E-Toll', date: '2026-05-21' },
  { id: 't-13', userId: '1', categoryId: 'cat-6', type: 'expense', amount: 330000, note: 'Tagihan Listrik & Wifi', date: '2026-05-15' },
  { id: 't-14', userId: '1', categoryId: 'cat-5', type: 'expense', amount: 800000, note: 'Belanja Bulanan Supermarket', date: '2026-05-10' },
  { id: 't-15', userId: '1', categoryId: 'cat-2', type: 'income', amount: 1500000, note: 'Desain Logo Startup', date: '2026-05-08' },
  { id: 't-16', userId: '1', categoryId: 'cat-7', type: 'expense', amount: 200000, note: 'Beli Game Steam', date: '2026-05-05' },

  // April 2026
  { id: 't-17', userId: '1', categoryId: 'cat-1', type: 'income', amount: 5000000, note: 'Gaji Bulanan Utama', date: '2026-04-25' },
  { id: 't-18', userId: '1', categoryId: 'cat-3', type: 'expense', amount: 95000, note: 'Makan Malam di Kafe', date: '2026-04-22' },
  { id: 't-19', userId: '1', categoryId: 'cat-4', type: 'expense', amount: 150000, note: 'Isi Bensin Mobil', date: '2026-04-18' },
  { id: 't-20', userId: '1', categoryId: 'cat-6', type: 'expense', amount: 340000, note: 'Tagihan Listrik & Wifi', date: '2026-04-15' },
  { id: 't-21', userId: '1', categoryId: 'cat-5', type: 'expense', amount: 250000, note: 'Beli Sepatu Baru', date: '2026-04-12' },

  // Maret 2026
  { id: 't-22', userId: '1', categoryId: 'cat-1', type: 'income', amount: 5000000, note: 'Gaji Bulanan Utama', date: '2026-03-25' },
  { id: 't-23', userId: '1', categoryId: 'cat-3', type: 'expense', amount: 55000, note: 'Beli Cemilan Sore', date: '2026-03-20' },
  { id: 't-24', userId: '1', categoryId: 'cat-6', type: 'expense', amount: 350000, note: 'Tagihan Listrik & Wifi', date: '2026-03-15' },
  { id: 't-25', userId: '1', categoryId: 'cat-2', type: 'income', amount: 800000, note: 'Pembuatan Slicing Web Figma', date: '2026-03-10' },

  // Februari 2026
  { id: 't-26', userId: '1', categoryId: 'cat-1', type: 'income', amount: 5000000, note: 'Gaji Bulanan Utama', date: '2026-02-25' },
  { id: 't-27', userId: '1', categoryId: 'cat-3', type: 'expense', amount: 40000, note: 'Makan Bakso Lapangan Tembak', date: '2026-02-18' },
  { id: 't-28', userId: '1', categoryId: 'cat-6', type: 'expense', amount: 320000, note: 'Tagihan Listrik & Wifi', date: '2026-02-15' },

  // Januari 2026
  { id: 't-29', userId: '1', categoryId: 'cat-1', type: 'income', amount: 5000000, note: 'Gaji Bulanan Utama', date: '2026-01-25' },
  { id: 't-30', userId: '1', categoryId: 'cat-3', type: 'expense', amount: 30000, note: 'Makan Nasi Padang', date: '2026-01-10' }
];

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};
