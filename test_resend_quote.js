#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const nodemailer = require('nodemailer');

// Models
const Quote = require('./backend/src/models/Quote');

// Services
const { generateQuotePDF, sendQuoteEmail } = require('./backend/src/services/quoteService');

const mongodb_uri = process.env.MONGODB_URI || 'mongodb+srv://augusto:EcommerceFull@ecommercedb.d9vnd.mongodb.net/ecommerce?retryWrites=true&w=majority';

const testResendQuote = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(mongodb_uri);
    console.log('✅ MongoDB conectado');

    // Verificar mailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('\n📧 Verificando configuración SMTP...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_USER);
    console.log('From:', process.env.EMAIL_FROM);

    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP error:', error.message);
      } else {
        console.log('✅ SMTP listo');
      }
    });

    // Buscar presupuesto
    console.log('\n📋 Buscando presupuesto PSP-1779590183530...');
    const quote = await Quote.findOne({ numero: 'PSP-1779590183530' });

    if (!quote) {
      console.error('❌ Presupuesto no encontrado');
      process.exit(1);
    }

    console.log('✅ Presupuesto encontrado:');
    console.log('  - Cliente:', quote.client.nombre, '(' + quote.client.email + ')');
    console.log('  - Items:', quote.items.length);
    console.log('  - Total USD:', quote.totales?.USD?.total);
    console.log('  - Total ARS:', quote.totales?.ARS?.total);

    // Generar PDF
    console.log('\n📄 Generando PDF...');
    const pdfBuffer = await generateQuotePDF(quote);
    console.log('✅ PDF generado, tamaño:', pdfBuffer.length, 'bytes');

    // Enviar email
    console.log('\n📧 Enviando email...');
    const result = await sendQuoteEmail(quote, pdfBuffer);
    console.log('✅ Email enviado exitosamente!');
    console.log('  - Message ID:', result.messageId);
    console.log('  - To:', quote.client.email);
    console.log('  - Subject:', `Presupuesto #${quote.numero} - SAUSANSYSTEM`);

    console.log('\n✅ Test completado exitosamente');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.command) console.error('Command:', error.command);
    if (error.response) console.error('Response:', error.response);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB desconectado');
  }
};

testResendQuote();
