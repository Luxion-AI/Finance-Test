const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { DEFAULT_CATEGORIES } = require('../lib/constants');

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
          const defaultPassword = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              password: defaultPassword,
            },
          });

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
