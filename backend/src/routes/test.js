const express = require('express');
const router = express.Router();

router.get('/debug', async (req, res) => {
  res.json({ status: 'ok', message: 'Debug endpoint' });
});

router.get('/mp-config', async (req, res) => {
  const token = process.env.MP_ACCESS_TOKEN || '';
  res.json({
    mpToken: {
      exists: !!token,
      length: token.length,
    },
    backendUrl: process.env.BACKEND_URL || 'NOT SET',
  });
});

router.get('/email-config', async (req, res) => {
  res.json({
    smtp: {
      host: process.env.SMTP_HOST || 'NOT SET',
      port: process.env.SMTP_PORT || 'NOT SET',
      user: process.env.SMTP_USER || 'NOT SET',
      passExists: !!process.env.SMTP_PASS,
      passLength: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
    },
    emailFrom: process.env.EMAIL_FROM || 'NOT SET',
    adminEmail: process.env.ADMIN_EMAIL || 'NOT SET',
    storeName: process.env.STORE_NAME || 'NOT SET',
  });
});

router.post('/send-test-email', async (req, res) => {
  try {
    const transporter = require('../config/mailer');
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ error: 'SMTP_USER or SMTP_PASS not set' });
    }
    
    const mailOptions = {
      to: req.body.to || 'augusto@gmail.com',
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      subject: 'Test email from Render',
      html: `
        <html>
          <body>
            <h2>Test Email - Gmail SMTP</h2>
            <p>This is a test email sent from Render backend.</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>Environment:</strong> Render Production</p>
            <hr/>
            <p>If you received this, Gmail SMTP is working! ✅</p>
          </body>
        </html>
      `,
    };
    
    console.log('🧪 Test email sending to:', mailOptions.to, 'from:', mailOptions.from);
    const result = await transporter.sendMail(mailOptions);
    res.json({ 
      success: true, 
      message: 'Email enviado correctamente',
      to: mailOptions.to, 
      from: mailOptions.from,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('🧪 Test email error:', error);
    res.status(500).json({
      error: error.message,
      code: error.code,
      response: error.response,
    });
  }
});

module.exports = router;
