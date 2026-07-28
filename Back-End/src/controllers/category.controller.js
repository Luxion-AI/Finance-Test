const prisma = require('../lib/prisma');
const { ALLOWED_TYPES } = require('../lib/constants');

const getAll = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, type, icon, color } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi' });
    }
    if (!type || !ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: 'Tipe harus "income" atau "expense"' });
    }

    const trimmedName = name.trim();

    if (trimmedName.length > 50) {
      return res.status(400).json({ success: false, message: 'Nama kategori maksimal 50 karakter' });
    }

    const existing = await prisma.category.findFirst({
      where: { userId: req.user.id, name: trimmedName, type },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Kategori dengan nama ini sudah ada' });
    }

    const category = await prisma.category.create({
      data: { name: trimmedName, type, icon, color, userId: req.user.id },
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ success: false, message: 'ID kategori tidak valid' });
    }

    const existing = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    const { name, icon, color } = req.body;
    const data = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Nama kategori tidak boleh kosong' });
      }
      const trimmedName = name.trim();
      if (trimmedName.length > 50) {
        return res.status(400).json({ success: false, message: 'Nama kategori maksimal 50 karakter' });
      }
      const duplicate = await prisma.category.findFirst({
        where: { userId: req.user.id, name: trimmedName, type: existing.type, id: { not: categoryId } },
      });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Kategori dengan nama ini sudah ada' });
      }
      data.name = trimmedName;
    }
    if (icon !== undefined) data.icon = icon;
    if (color !== undefined) data.color = color;

    const category = await prisma.category.update({
      where: { id: categoryId },
      data,
    });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ success: false, message: 'ID kategori tidak valid' });
    }

    const existing = await prisma.category.findFirst({
      where: { id: categoryId, userId: req.user.id },
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    await prisma.category.delete({ where: { id: categoryId } });
    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, update, remove };
