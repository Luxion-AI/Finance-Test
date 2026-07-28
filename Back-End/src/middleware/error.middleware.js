const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Data duplikat sudah ada.' });
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ success: false, message: 'Masih ada transaksi yang menggunakan data ini. Hapus transaksi terkait terlebih dahulu.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Data tidak ditemukan.' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan pada server';

  res.status(statusCode).json({ success: false, message });
};

module.exports = { errorHandler };