const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Crear transporter con Hostinger SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: process.env.SMTP_PORT || 587, // Usar 587 (TLS) en lugar de 465 (SSL)
  secure: false, // false para puerto 587, true para 465
  auth: {
    user: process.env.SMTP_USER || 'administracion@sausansystem.com.ar',
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
  pool: {
    maxConnections: 5,
    maxMessages: 100,
  },
});

transporter.verify((error) => {
  if (error) {
    logger.warn('Mailer config error', { message: error.message });
  } else {
    logger.info('Mailer ready - using Hostinger SMTP');
  }
});

module.exports = transporter;
