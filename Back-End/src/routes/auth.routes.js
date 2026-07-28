const { Router } = require('express');
const { register, login, getMe, updateProfile, updatePassword, uploadAvatar, googleCallback, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../lib/upload');
const multer = require('multer');
const passport = require('../config/passport');

const router = Router();

// Multer error wrapper
const uploadAvatarMiddleware = (req, res, next) => {
  const single = upload.single('avatar');
  single(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Ukuran file maksimal 2MB' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/upload-avatar', protect, uploadAvatarMiddleware, uploadAvatar);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err || !user) {
        const baseUrl = process.env.NODE_ENV === 'production' ? '' : (process.env.FRONTEND_URL || 'http://localhost:5173');
        return res.redirect(`${baseUrl}/login?oauth_error=${encodeURIComponent(err?.message || 'Gagal login dengan Google. Pastikan email Anda sudah ditambahkan sebagai Test User di Google Cloud Console.')}`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleCallback
);

module.exports = router;
