const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Tidak terotorisasi, token tidak ada' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah expired' });
  }
};

module.exports = { protect };