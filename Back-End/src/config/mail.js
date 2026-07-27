const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.log('⚠️  Email not configured. Set MAIL_USER & MAIL_PASS in .env');
    console.log(`📧 Would send email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    return { devMode: true };
  }
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || 'FinTrack <noreply@fintrack.app>',
    to,
    subject,
    html,
  });
  console.log(`📧 Email sent: ${info.messageId}`);
  return { devMode: false, messageId: info.messageId };
};

module.exports = { sendEmail };
