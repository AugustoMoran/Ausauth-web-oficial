const mongoose = require('mongoose');

// Conectar a MongoDB
const MONGO_URI = 'mongodb+srv://sausansystem_db_user:nAUEA5pkRu7cQXZ8@cluster0.t0ochfx.mongodb.net/?appName=Cluster0';

const quoteSchema = new mongoose.Schema({
  numero: { type: String, unique: true },
  client: {
    _id: mongoose.Schema.Types.ObjectId,
    nombre: String,
    email: String,
    telefono: String,
    direccion: {
      calle: String,
      numero: String,
      codigoPostal: String
    }
  },
  items: [{
    producto: mongoose.Schema.Types.ObjectId,
    nombre: String,
    cantidad: Number,
    precioUnitario: Number,
    subtotal: Number,
    currency: String
  }],
  instalacion: {
    incluye: Boolean,
    monto: Number,
    descripcion: String,
    currency: String
  },
  totales: {
    USD: { subtotal: Number, instalacion: Number, total: Number },
    ARS: { subtotal: Number, instalacion: Number, total: Number }
  },
  estado: String,
  enviado: { fecha: Date, email: String, visto: Boolean },
  createdBy: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now }
});

const Quote = mongoose.model('Quote', quoteSchema);

async function createAndSendQuote() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Crear presupuesto
    const newQuote = new Quote({
      numero: `PSP-${Date.now()}`,
      client: {
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
      createdAt: new Date()
    });

    const savedQuote = await newQuote.save();
    console.log('✅ Presupuesto creado:', savedQuote);

    // Ahora enviar por email
    console.log('📧 Enviando presupuesto por email...');
    const sendRes = await fetch(`https://ecommerce-gestion-trabajo.onrender.com/api/quotes/${savedQuote._id}/enviar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const sendData = await sendRes.json();
    console.log('📨 Respuesta del servidor:', sendData);

    await mongoose.connection.close();
    console.log('✅ Completado');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAndSendQuote();
