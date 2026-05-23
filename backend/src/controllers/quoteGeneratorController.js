const Quote = require('../models/Quote');
const User = require('../models/User');
const Product = require('../models/Product');
const PDFDocument = require('pdfkit');
const { generateQuotePDF, sendQuoteEmail } = require('../services/quoteService');

// In-memory error log for debugging
const pdfErrorLog = [];
function logPDFError(msg) {
  const log = { timestamp: new Date().toISOString(), msg };
  pdfErrorLog.push(log);
  if (pdfErrorLog.length > 50) pdfErrorLog.shift(); // Keep only last 50
  console.error('📝 [PDF-LOG]', msg);
}

// Función helper para calcular totales por moneda
const calculateTotalsByByCurrency = (items, instalacion) => {
  const currencies = { USD: 0, ARS: 0 };
  
  // Sumar items por moneda
  items.forEach(item => {
    const currency = item.currency || 'USD';
    currencies[currency] = (currencies[currency] || 0) + item.subtotal;
  });

  // Crear objeto de totales sin duplicar instalación
  const totales = {
    USD: {
      subtotal: currencies.USD || 0,
      instalacion: 0,
      total: currencies.USD || 0,
    },
    ARS: {
      subtotal: currencies.ARS || 0,
      instalacion: 0,
      total: currencies.ARS || 0,
    },
  };

  // Asignar instalación a la moneda que tenga productos (prioridad USD)
  if (instalacion?.incluye && instalacion.monto > 0) {
    if (totales.USD.subtotal > 0) {
      totales.USD.instalacion = instalacion.monto;
      totales.USD.total = totales.USD.subtotal + instalacion.monto;
    } else if (totales.ARS.subtotal > 0) {
      totales.ARS.instalacion = instalacion.monto;
      totales.ARS.total = totales.ARS.subtotal + instalacion.monto;
    } else {
      // Si no hay productos, asignar a USD por defecto
      totales.USD.instalacion = instalacion.monto;
      totales.USD.total = instalacion.monto;
    }
  }

  // Total final es suma de ambas monedas
  const total = totales.USD.total + totales.ARS.total;

  return {
    USD: totales.USD,
    ARS: totales.ARS,
    subtotal: currencies.USD + currencies.ARS,
    instalacion: instalacion?.incluye ? instalacion.monto : 0,
    descuento: 0,
    total,
  };
};

const createQuote = async (req, res, next) => {
  try {
    console.log('🔍 CreateQuote - User role:', req.user.role);
    console.log('🔍 CreateQuote - Body received:', JSON.stringify(req.body, null, 2));

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores pueden crear presupuestos' });
    }

    const { clientId, items, instalacion, notas } = req.body;
    
    console.log('🔍 ClientId:', clientId);
    console.log('🔍 Items:', JSON.stringify(items, null, 2));

    const client = await User.findById(clientId);
    if (!client) {
      console.log('❌ Cliente no encontrado con ID:', clientId);
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    console.log('✅ Cliente encontrado:', client.nombre);

    const processedItems = await Promise.all(
      items.map(async (item) => {
        console.log('🔍 Processing item:', item);
        const product = await Product.findById(item.producto);
        console.log('🔍 Product found:', product?.nombre || 'PRODUCTO NO ENCONTRADO', 'para ID:', item.producto);
        return {
          producto: item.producto,
          nombre: item.nombre || product?.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          subtotal: item.cantidad * item.precioUnitario,
          currency: item.currency || 'USD',
        };
      })
    );

    // Calcular totales por moneda
    const totales = calculateTotalsByByCurrency(processedItems, instalacion);

    const lastQuote = await Quote.findOne().sort({ createdAt: -1 });
    const nextNumber = lastQuote ? parseInt(lastQuote.numero.split('-')[1]) + 1 : 1;
    const numero = `PSP-${String(nextNumber).padStart(4, '0')}`;

    const quote = new Quote({
      numero,
      client: {
        _id: client._id,
        nombre: client.nombre,
        email: client.email,
        telefono: client.telefono,
        direccion: client.direccion,
      },
      items: processedItems,
      instalacion: {
        incluye: instalacion?.incluye || false,
        monto: instalacion?.monto || 0,
        descripcion: instalacion?.descripcion,
      },
      totales,
      notas,
      createdBy: req.user._id,
    });

    await quote.save();
    res.status(201).json(quote);
  } catch (error) {
    next(error);
  }
};

const getAllQuotes = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }
    const quotes = await Quote.find().sort({ createdAt: -1 }).populate('createdBy', 'nombre');
    res.json(quotes);
  } catch (error) {
    next(error);
  }
};

const getQuoteById = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id).populate('createdBy', 'nombre');
    if (!quote) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }

    if (req.user.role !== 'admin' && quote.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.json(quote);
  } catch (error) {
    next(error);
  }
};

const getMyQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ 'client._id': req.user._id }).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    next(error);
  }
};

const updateQuote = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }

    if (quote.estado !== 'borrador') {
      return res.status(400).json({ message: 'Solo se pueden editar presupuestos en borrador' });
    }

    const { items, instalacion, notas } = req.body;

    if (items) {
      const processedItems = await Promise.all(
        items.map(async (item) => {
          const product = await Product.findById(item.producto);
          return {
            producto: item.producto,
            nombre: item.nombre || product?.nombre,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.cantidad * item.precioUnitario,
            currency: item.currency || 'USD',
          };
        })
      );
      quote.items = processedItems;
    }

    if (instalacion) {
      quote.instalacion = {
        incluye: instalacion.incluye || false,
        monto: instalacion.monto || 0,
        descripcion: instalacion.descripcion,
      };
    }

    if (notas !== undefined) {
      quote.notas = notas;
    }

    // Calcular totales por moneda
    quote.totales = calculateTotalsByByCurrency(quote.items, quote.instalacion);

    await quote.save();
    res.json(quote);
  } catch (error) {
    next(error);
  }
};

const sendQuote = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }

    try {
      const pdfBuffer = await generateQuotePDF(quote);
      
      // Intentar enviar email sin bloquear
      sendQuoteEmail(quote, pdfBuffer).catch((emailError) => {
        console.error('Email send error:', emailError);
        // No fallar la request si el email falla
      });
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      // Continuar incluso si el PDF falla
    }

    quote.estado = 'enviado';
    quote.enviado = {
      fecha: new Date(),
      email: quote.client.email,
      visto: false,
    };

    await quote.save();
    res.json({ message: 'Presupuesto enviado', quote });
  } catch (error) {
    next(error);
  }
};

const downloadQuotePDF = async (req, res, next) => {
  try {
    logPDFError(`📥 Download request: ${req.params.id}`);
    
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      logPDFError(`❌ Quote not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }

    // Check auth
    const clientId = quote.client?._id?.toString?.() || quote.client?._id;
    const userId = req.user._id?.toString?.() || req.user._id;
    
    if (req.user.role !== 'admin' && clientId !== userId) {
      logPDFError(`❌ Unauthorized: role=${req.user.role} clientId=${clientId} userId=${userId}`);
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Generate PDF as base64 string instead of streaming
    logPDFError(`📄 Creating PDF for ${quote.numero}`);
    
    const PDFDocument = require('pdfkit');
    const chunks = [];
    
    const doc = new PDFDocument();
    
    // Collect chunks
    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    doc.on('error', (err) => {
      logPDFError(`❌ PDF error event: ${err.message}`);
    });
    
    doc.on('finish', () => {
      try {
        const pdfBuffer = Buffer.concat(chunks);
        const base64PDF = pdfBuffer.toString('base64');
        
        logPDFError(`✅ PDF generated: ${pdfBuffer.length} bytes, base64: ${base64PDF.length} chars`);
        
        // Send as JSON with base64
        res.json({
          success: true,
          pdf: base64PDF,
          filename: `presupuesto-${quote.numero}.pdf`,
          size: pdfBuffer.length
        });
      } catch (err) {
        logPDFError(`❌ Error on finish: ${err.message}`);
        if (!res.headersSent) {
          res.status(500).json({ error: err.message });
        }
      }
    });
    
    // Add content
    doc.fontSize(20).text('PRESUPUESTO', 100, 100);
    doc.fontSize(14).text(`Nº: ${quote.numero}`);
    doc.text(`Cliente: ${quote.client?.nombre || 'N/A'}`);
    
    // Items
    doc.moveDown();
    doc.text('Productos:');
    if (quote.items && Array.isArray(quote.items)) {
      quote.items.forEach(item => {
        doc.fontSize(11).text(`  - ${item.nombre} x ${item.cantidad}`);
      });
    }
    
    // Total
    doc.moveDown();
    const total = quote.totales?.USD?.total || quote.totales?.ARS?.total || 0;
    doc.fontSize(16).text(`TOTAL: $${total}`);
    
    // End
    doc.end();
    logPDFError(`✅ PDF generation started for ${quote.numero}`);
    
  } catch (error) {
    logPDFError(`❌ ERROR: ${error.message}`);
    logPDFError(`STACK: ${error.stack}`);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
  }
};

const updateQuoteStatus = async (req, res, next) => {
  try {
    const { estado } = req.body;

    if (!['aceptado', 'rechazado'].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }

    if (quote.client._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    quote.estado = estado;
    await quote.save();

    res.json({ message: `Presupuesto marcado como ${estado}`, quote });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/quotes/:id - eliminar presupuesto (solo admin, solo borrador o enviado)
const deleteQuote = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Presupuesto no encontrado' });
    }

    // Permitir eliminar presupuestos en estado borrador o enviado
    if (!['borrador', 'enviado'].includes(quote.estado)) {
      return res.status(400).json({ message: 'Solo se pueden eliminar presupuestos en estado borrador o enviado' });
    }

    await Quote.findByIdAndDelete(req.params.id);

    res.json({ message: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

// TEST ENDPOINT - Generate simple PDF to test PDFKit
const testPDF = async (req, res, next) => {
  try {
    console.log('🧪 [TEST-PDF] Starting test PDF generation');
    const chunks = [];
    
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4'
    });

    console.log('🧪 [TEST-PDF] PDFDocument created');

    doc.on('data', (chunk) => {
      console.log('🧪 [TEST-PDF] Chunk received:', chunk.length, 'bytes');
      chunks.push(chunk);
    });

    doc.on('error', (err) => {
      console.error('🧪 [TEST-PDF] Error event:', err.message);
    });

    doc.on('finish', () => {
      try {
        console.log('🧪 [TEST-PDF] Finish event triggered');
        const pdfBuffer = Buffer.concat(chunks);
        console.log('🧪 [TEST-PDF] Buffer size:', pdfBuffer.length, 'bytes');
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="test.pdf"');
        res.write(pdfBuffer);
        res.end();
        console.log('🧪 [TEST-PDF] Response sent');
      } catch (err) {
        console.error('🧪 [TEST-PDF] Finish error:', err.message);
        if (!res.headersSent) {
          res.status(500).json({ error: err.message });
        }
      }
    });

    // Add minimal content
    console.log('🧪 [TEST-PDF] Adding content');
    doc.fontSize(20).text('TEST PDF', { align: 'center' });
    doc.text('This is a test PDF to verify PDFKit works in Render');
    doc.text('If you see this, PDF generation is working!');
    
    console.log('🧪 [TEST-PDF] Calling doc.end()');
    doc.end();
    console.log('🧪 [TEST-PDF] doc.end() called');
  } catch (error) {
    console.error('🧪 [TEST-PDF] Outer error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET PDF error log for debugging
const getPDFErrorLog = (req, res) => {
  res.json({ errors: pdfErrorLog, totalErrors: pdfErrorLog.length });
};

module.exports = {
  createQuote,
  getAllQuotes,
  getQuoteById,
  getMyQuotes,
  updateQuote,
  sendQuote,
  downloadQuotePDF,
  updateQuoteStatus,
  deleteQuote,
  testPDF,
  getPDFErrorLog,
};
