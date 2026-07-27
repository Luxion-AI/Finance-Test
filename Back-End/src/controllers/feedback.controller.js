const prisma = require('../lib/prisma');

const sendFeedback = async (req, res, next) => {
  try {
    const { type, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Pesan tidak boleh kosong' });
    }

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user.id,
        type: type || 'saran',
        message: message.trim(),
      },
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendFeedback };