const prisma = require('../lib/prisma');

const getAll = async (req, res, next) => {
  try {
    const { month, year } = req.query;

    const where = { userId: req.user.id };
    if (month) {
      const m = parseInt(month);
      if (isNaN(m) || m < 1 || m > 12) {
        return res.status(400).json({ success: false, message: 'Bulan harus antara 1-12' });
      }
      where.month = m;
    }
    if (year) {
      const y = parseInt(year);
      if (isNaN(y) || y < 2000 || y > 2100) {
        return res.status(400).json({ success: false, message: 'Tahun tidak valid' });
      }
      where.year = y;
    }

    const budgets = await prisma.budget.findMany({
      where,
      include: { category: true },
    });

    const result = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await prisma.transaction.aggregate({
          where: {
            userId: req.user.id,
            categoryId: budget.categoryId,
            type: 'expense',
            date: {
              gte: new Date(budget.year, budget.month - 1, 1),
              lt: new Date(budget.year, budget.month, 1),
            },
          },
          _sum: { amount: true },
        });

        const totalSpent = spent._sum.amount || 0;
        return {
          ...budget,
          spent: totalSpent,
          remaining: budget.amount - totalSpent,
          percentage: budget.amount > 0 ? Math.round((totalSpent / budget.amount) * 100) : 0,
        };
      })
    );

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { amount, month, year, categoryId } = req.body;

    if (amount === undefined || amount === null) {
      return res.status(400).json({ success: false, message: 'Jumlah budget wajib diisi' });
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Jumlah budget harus berupa angka positif' });
    }

    const parsedMonth = parseInt(month);
    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ success: false, message: 'Bulan harus antara 1-12' });
    }

    const parsedYear = parseInt(year);
    if (isNaN(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
      return res.status(400).json({ success: false, message: 'Tahun tidak valid' });
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

    const existing = await prisma.budget.findFirst({
      where: {
        userId: req.user.id,
        categoryId: parsedCategoryId,
        month: parsedMonth,
        year: parsedYear,
      },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Budget untuk kategori ini di bulan tersebut sudah ada' });
    }

    const budget = await prisma.budget.create({
      data: {
        amount: parsedAmount,
        month: parsedMonth,
        year: parsedYear,
        categoryId: parsedCategoryId,
        userId: req.user.id,
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const budgetId = parseInt(id);

    if (isNaN(budgetId)) {
      return res.status(400).json({ success: false, message: 'ID budget tidak valid' });
    }

    const existing = await prisma.budget.findFirst({
      where: { id: budgetId, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Budget tidak ditemukan' });
    }

    const { amount } = req.body;
    const data = {};

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Jumlah budget harus berupa angka positif' });
      }
      data.amount = parsedAmount;
    }

    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data,
      include: { category: true },
    });

    res.json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const budgetId = parseInt(id);

    if (isNaN(budgetId)) {
      return res.status(400).json({ success: false, message: 'ID budget tidak valid' });
    }

    const existing = await prisma.budget.findFirst({
      where: { id: budgetId, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Budget tidak ditemukan' });
    }

    await prisma.budget.delete({ where: { id: budgetId } });
    res.json({ success: true, message: 'Budget berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, update, remove };
