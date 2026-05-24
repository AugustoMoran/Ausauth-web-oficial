const mongoose = require('mongoose');
const Quote = require('./src/models/Quote');
const { sendQuoteEmail } = require('./src/services/quoteService');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sausansystem_db_user:nAUEA5pkRu7cQXZ8@cluster0.t0ochfx.mongodb.net/?appName=Cluster0';

async function createAndSendQuote() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Crear presupuesto
    const newQuote = new Quote({
      numero: `PSP-${Date.now()}`,
      client: {
        _id: new mongoose.Types.ObjectId('66cdc7790f8c152000e57770'), // admin user ID
        nombre: "Augusto Morán",
        email: "augusto.moran.informatica@gmail.com",
        telefono: "+54 9 11 6839-3582",
        direccion: {
          calle: "Test Street",
          numero: "123",
          codigoPostal: "1111"
        }
      },
      items: [{
        nombre: "Router Industrial",
        cantidad: 1,
        precioUnitario: 500,
        subtotal: 500,
        currency: "USD"
      }],
      instalacion: {
        incluye: true,
        monto: 200,
        descripcion: "Instalación en sitio",
        currency: "USD"
      },
      totales: {
        USD: { subtotal: 500, instalacion: 200, total: 700 },
        ARS: { subtotal: 0, instalacion: 0, total: 0 }
      },
      estado: "borrador",
      createdBy: new mongoose.Types.ObjectId('66cdc7790f8c152000e57770'), // admin user ID
      createdAt: new Date()
    });

    const savedQuote = await newQuote.save();
    console.log('✅ Presupuesto creado:', savedQuote.numero);
    console.log('📋 ID:', savedQuote._id);

    // Enviar por email
    console.log('📧 Enviando presupuesto por email...');
    try {
      await sendQuoteEmail(savedQuote);
      console.log('✅ Email enviado correctamente');
    } catch (emailError) {
      console.error('⚠️  Error en email:', emailError.message);
    }

    await mongoose.connection.close();
    console.log('✅ Completado');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

createAndSendQuote();
