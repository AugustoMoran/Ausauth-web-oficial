#!/usr/bin/env node

// Load env variables manually
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'backend', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

envContent.split('\n').forEach((line) => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  }
});

const nodemailer = require('./backend/node_modules/nodemailer');

console.log('🔍 Email Configuration Test\n');
console.log('Environment Variables:');
console.log('  SMTP_HOST:', process.env.SMTP_HOST);
console.log('  SMTP_PORT:', process.env.SMTP_PORT);
console.log('  SMTP_USER:', process.env.SMTP_USER);
console.log('  SMTP_PASS:', process.env.SMTP_PASS ? '****' : 'NOT SET');
console.log('  EMAIL_FROM:', process.env.EMAIL_FROM);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log('\n📧 Testing Email Transporter...\n');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Failed:');
    console.error('  Error:', error.message);
    console.error('  Code:', error.code);
    console.error('  Command:', error.command);
    process.exit(1);
  } else {
    console.log('✅ SMTP Connection Successful!');
    console.log('  Server is ready to take our messages');
    
    // Try sending a test email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: 'augusto.moran.informatica@gmail.com',
      subject: '🧪 Test Email from SAUSANSYSTEM',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your SAUSANSYSTEM server.</p>
        <p>If you received this, the email configuration is working!</p>
        <hr/>
        <p><small>Sent at: ${new Date().toISOString()}</small></p>
      `,
    };
    
    console.log('\n📬 Sending Test Email to:', mailOptions.to);
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ Email Send Failed:');
        console.error('  Error:', err.message);
        console.error('  Code:', err.code);
        process.exit(1);
      } else {
        console.log('✅ Email Sent Successfully!');
        console.log('  Message ID:', info.messageId);
        console.log('  Response:', info.response);
        process.exit(0);
      }
    });
  }
});

// Timeout after 30 seconds
setTimeout(() => {
  console.error('⏱️ Timeout: SMTP connection took too long');
  process.exit(1);
}, 30000);
