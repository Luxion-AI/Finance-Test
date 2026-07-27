const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ------------- GOOGLE OAUTH -------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'google-client-id-placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret-placeholder',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('Email tidak ditemukan di akun Google'), null);
        }

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          const defaultPassword = await bcrypt.hash(Math.random().toString(36), 10);
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              password: defaultPassword,
            },
          });

          const DEFAULT_CATEGORIES = [
            { name: 'Gaji', type: 'income', icon: 'Briefcase', color: '#10b981' },
            { name: 'Freelance', type: 'income', icon: 'Laptop', color: '#3b82f6' },
            { name: 'Investasi', type: 'income', icon: 'TrendingUp', color: '#8b5cf6' },
            { name: 'Hadiah', type: 'income', icon: 'Gift', color: '#f59e0b' },
            { name: 'Makanan', type: 'expense', icon: 'UtensilsCrossed', color: '#ef4444' },
            { name: 'Transportasi', type: 'expense', icon: 'Car', color: '#8b5cf6' },
            { name: 'Belanja', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
            { name: 'Tagihan', type: 'expense', icon: 'Receipt', color: '#f97316' },
            { name: 'Hiburan', type: 'expense', icon: 'Gamepad2', color: '#06b6d4' },
            { name: 'Kesehatan', type: 'expense', icon: 'Heart', color: '#ef4444' },
            { name: 'Pendidikan', type: 'expense', icon: 'GraduationCap', color: '#3b82f6' },
            { name: 'Rumah', type: 'expense', icon: 'Home', color: '#14b8a6' },
          ];
          await prisma.category.createMany({
            data: DEFAULT_CATEGORIES.map((cat) => ({ ...cat, userId: user.id })),
          });
        }

        const token = generateToken(user.id);
        return done(null, { token, user: { id: user.id, name: user.name, email: user.email } });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
