const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const path = require('path');
const { sendEmail } = require('../config/mail');
const { DEFAULT_CATEGORIES } = require('../lib/constants');
const { put, del } = require('@vercel/blob');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const userSelect = { id: true, name: true, email: true, avatar: true };

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: userSelect,
    });

    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        userId: user.id,
      })),
    });

    const token = generateToken(user.id);
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { ...userSelect, password: true },
    });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, token, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: userSelect,
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (email !== req.user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Email sudah digunakan akun lain' });
      }
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: userSelect,
    });

    res.json({ success: true, user: updated });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password lama salah' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    res.json({ success: true, message: 'Password berhasil diperbarui' });
  } catch (error) {
    next(error);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File tidak ditemukan' });
    }

    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (currentUser.avatar && currentUser.avatar.includes('public.blob.vercel-storage.com')) {
      try {
        await del(currentUser.avatar);
      } catch (err) {
        console.error('Failed to delete old avatar blob:', err);
      }
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `avatars/avatar-${req.user.id}-${Date.now()}${ext}`;
    
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
    });

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: blob.url },
      select: userSelect,
    });

    res.json({ success: true, user: updated });
  } catch (error) {
    next(error);
  }
};

const googleCallback = (req, res) => {
  const { token, user } = req.user;
  const baseUrl = process.env.NODE_ENV === 'production' ? '' : (process.env.FRONTEND_URL || 'http://localhost:5173');
  res.redirect(`${baseUrl}/oauth-callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email wajib diisi' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ success: true, message: 'Jika email terdaftar, link reset akan dikirim' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#3b82f6">Reset Password FinTrack</h2>
        <p>Klik tombol di bawah untuk mereset password kamu:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold">Reset Password</a>
        <p style="margin-top:24px;color:#94a3b8;font-size:13px">Link ini berlaku selama 1 jam. Abaikan email ini jika kamu tidak meminta reset password.</p>
      </div>
    `;

    const result = await sendEmail({ to: email, subject: 'Reset Password FinTrack', html });

    if (result.devMode) {
      console.log(`🔗 Reset link: ${resetUrl}`);
    }

    res.json({ success: true, message: 'Jika email terdaftar, link reset akan dikirim' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' });
    }

    const users = await prisma.user.findMany({
      where: { resetToken: { not: null }, resetTokenExpiry: { gt: new Date() } },
    });

    let matchedUser = null;
    for (const user of users) {
      const isValid = await bcrypt.compare(token, user.resetToken);
      if (isValid) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser || !matchedUser.resetTokenExpiry || matchedUser.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: matchedUser.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });

    res.json({ success: true, message: 'Password berhasil direset. Silakan login.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, updatePassword, uploadAvatar, googleCallback, forgotPassword, resetPassword };
