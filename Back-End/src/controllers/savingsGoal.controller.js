const prisma = require('../lib/prisma');

const getAll = async (req, res, next) => {
  try {
    const goals = await prisma.savingsGoal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, targetAmount, currentAmount, deadline, icon, color } = req.body;
    if (!name || !targetAmount) {
      return res.status(400).json({ message: 'Nama dan target wajib diisi' });
    }
    const goal = await prisma.savingsGoal.create({
      data: {
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        deadline: deadline ? new Date(deadline) : null,
        icon: icon || 'Target',
        color: color || '#3b82f6',
        userId: req.user.id,
      },
    });
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, targetAmount, currentAmount, deadline, icon, color } = req.body;
    const goal = await prisma.savingsGoal.findFirst({ where: { id: parseInt(id), userId: req.user.id } });
    if (!goal) return res.status(404).json({ message: 'Goal tidak ditemukan' });
    const updated = await prisma.savingsGoal.update({
      where: { id: parseInt(id) },
      data: {
        name: name ?? goal.name,
        targetAmount: targetAmount ? parseFloat(targetAmount) : goal.targetAmount,
        currentAmount: currentAmount !== undefined ? parseFloat(currentAmount) : goal.currentAmount,
        deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : goal.deadline,
        icon: icon ?? goal.icon,
        color: color ?? goal.color,
      },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await prisma.savingsGoal.findFirst({ where: { id: parseInt(id), userId: req.user.id } });
    if (!goal) return res.status(404).json({ message: 'Goal tidak ditemukan' });
    await prisma.savingsGoal.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Goal berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

const addFunds = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const goal = await prisma.savingsGoal.findFirst({ where: { id: parseInt(id), userId: req.user.id } });
    if (!goal) return res.status(404).json({ message: 'Goal tidak ditemukan' });
    const updated = await prisma.savingsGoal.update({
      where: { id: parseInt(id) },
      data: { currentAmount: goal.currentAmount + parseFloat(amount) },
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, update, remove, addFunds };
