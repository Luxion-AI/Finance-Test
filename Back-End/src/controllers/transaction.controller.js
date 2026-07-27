const prisma = require('../lib/prisma');

const ALLOWED_TYPES = ['income', 'expense'];

const getAll = async (req, res, next) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
    res.json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { amount, description, date, type, categoryId } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ success: false, message: 'Jumlah wajib diisi' });
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Jumlah harus berupa angka positif' });
    }

    if (!type || !ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: 'Tipe harus "income" atau "expense"' });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: 'Tanggal wajib diisi' });
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Format tanggal tidak valid' });
    }

    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ success: false, message: 'ID kategori tidak valid' });
    }

    const category = await prisma.category.findFirst({
      where: { id: parsedCategoryId, userId: req.user.id },
    });
    if (!category) {
      return res.status(400).json({ success: false, message: 'Kategori tidak ditemukan atau bukan milik Anda' });
    }

    const trimmedDesc = description ? description.trim() : '';

    const transaction = await prisma.transaction.create({
      data: {
        amount: parsedAmount,
        description: trimmedDesc,
        date: parsedDate,
        type,
        categoryId: parsedCategoryId,
        userId: req.user.id,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transactionId = parseInt(id);

    if (isNaN(transactionId)) {
      return res.status(400).json({ success: false, message: 'ID transaksi tidak valid' });
    }

    const existing = await prisma.transaction.findFirst({
      where: { id: transactionId, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    const { amount, description, date, type, categoryId } = req.body;
    const data = {};

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Jumlah harus berupa angka positif' });
      }
      data.amount = parsedAmount;
    }

    if (type !== undefined) {
      if (!ALLOWED_TYPES.includes(type)) {
        return res.status(400).json({ success: false, message: 'Tipe harus "income" atau "expense"' });
      }
      data.type = type;
    }

    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: 'Format tanggal tidak valid' });
      }
      data.date = parsedDate;
    }

    if (categoryId !== undefined) {
      const parsedCategoryId = parseInt(categoryId);
      if (isNaN(parsedCategoryId)) {
        return res.status(400).json({ success: false, message: 'ID kategori tidak valid' });
      }
      const category = await prisma.category.findFirst({
        where: { id: parsedCategoryId, userId: req.user.id },
      });
      if (!category) {
        return res.status(400).json({ success: false, message: 'Kategori tidak ditemukan atau bukan milik Anda' });
      }
      data.categoryId = parsedCategoryId;
    }

    if (description !== undefined) {
      data.description = description ? description.trim() : '';
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data,
      include: { category: true },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transactionId = parseInt(id);

    if (isNaN(transactionId)) {
      return res.status(400).json({ success: false, message: 'ID transaksi tidak valid' });
    }

    const existing = await prisma.transaction.findFirst({
      where: { id: transactionId, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    await prisma.transaction.delete({ where: { id: transactionId } });
    res.json({ success: true, message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, update, remove };
