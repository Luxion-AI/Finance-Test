// Vercel serverless entry point for Express API
// All /api/* requests are rewritten to this handler
const app = require('../Back-End/src/app');

module.exports = (req, res) => {
  return app(req, res);
};
