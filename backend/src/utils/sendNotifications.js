const transporter = require('../config/mailer');
const { formatQuoteMoney } = require('./quoteCurrencyFormat');

const formatOrderItems = (items) => {
  return items
    .map((i) => {
      const attrs = [i.talla && `Talla: ${i.talla}`, i.color && `Color: ${i.color}`].filter(Boolean);
      const attrStr = attrs.length ? ` (${attrs.join(', ')})` : '';
      return `- ${i.nombre} x${i.cantidad}${attrStr} = $${(i.precio * i.cantidad).toFixed(2)}`;
    })
    .join('\n');
};

const sendOrderConfirmationToUser = async (email, order) => {
  const itemsText = formatOrderItems(order.items);
  const userName = order.usuario 
    ? `${order.usuario.nombre} ${order.usuario.apellido}`
    : `${order.guestData.nombre} ${order.guestData.apellido}`;
  
  const estadoPagoLabel = {
    'aprobado': '✅ Pagado',
    'pendiente': '⏳ Pago pendiente',
    'rechazado': '❌ Pago rechazado',
    'reembolsado': '💰 Reembolsado'
  }[order.estadoPago] || order.estadoPago;
  
  await transporter.sendMail({
    from: `"${process.env.STORE_NAME || 'Tienda Online'}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `✅ Confirmación de pedido #${order.codigo}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2563eb">¡Gracias por tu compra, ${userName}!</h2>
        <p>Tu código de pedido es: <strong style="font-size:20px;color:#1e40af">${order.codigo}</strong></p>
        <h3>Detalle de tu pedido:</h3>
        <pre style="background:#f1f5f9;padding:12px;border-radius:8px">${itemsText}</pre>
        <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
        <p>Estado de pago: <strong>${estadoPagoLabel}</strong></p>
        <p>Método de pago: <strong>${order.metodoPago}</strong></p>
        <p style="color:#64748b;font-size:12px;margin-top:20px">Guardá este código para rastrear tu pedido.</p>
      </div>
    `,
  });
};

const sendOrderNotificationToAdmin = async (order) => {
  const itemsText = formatOrderItems(order.items);
  const recipientName = order.usuario
    ? `${order.usuario.nombre} ${order.usuario.apellido}`
    : `${order.guestData.nombre} ${order.guestData.apellido}`;
  const recipientEmail = order.usuario ? order.usuario.email : order.guestData.email;
  const recipientPhone = order.usuario ? order.usuario.telefono : order.guestData.telefono;
  const recipientAddress = order.usuario ? order.usuario.direccion : order.guestData.direccion;

  await transporter.sendMail({
    from: `"Sistema Tienda" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 Nueva orden #${order.codigo}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#dc2626">Nueva orden recibida</h2>
        <p><strong>Código:</strong> ${order.codigo}</p>
        <p><strong>Cliente:</strong> ${recipientName}</p>
        <p><strong>Email:</strong> ${recipientEmail}</p>
        <p><strong>Teléfono:</strong> ${recipientPhone || 'No proporcionado'}</p>
        <p><strong>Dirección:</strong> ${recipientAddress || 'No proporcionada'}</p>
        <p><strong>Pago:</strong> ${order.metodoPago} - ${order.estadoPago}</p>
        <h3>Productos:</h3>
        <pre style="background:#f1f5f9;padding:12px;border-radius:8px">${itemsText}</pre>
        <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
      </div>
    `,
  });
};

const sendShippingCodeEmail = async (email, order) => {
  await transporter.sendMail({
    from: `"${process.env.STORE_NAME || 'Tienda Online'}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `🚚 Tu pedido #${order.codigo} fue enviado`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#16a34a">¡Tu pedido está en camino!</h2>
        <p>Tu código de seguimiento: <strong style="font-size:20px;color:#15803d">${order.codigo}</strong></p>
        <p>Estado: <strong>Enviado</strong></p>
        <p>Te notificaremos cuando sea entregado.</p>
      </div>
    `,
  });
};

const sendQuoteAcceptanceToAdmin = async (quote) => {
  const clientName = quote.client?.nombre || 'Cliente desconocido';
  const clientEmail = quote.client?.email || 'No disponible';
  
  // Formatear items
  const itemsHtml = (quote.items || []).map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${item.nombre}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right">${item.cantidad}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right">${formatQuoteMoney(item.subtotal, item.currency)}</td>
    </tr>
  `).join('');

  const installationRow = quote.instalacion?.incluye ? `
    <tr style="background:#f0f9ff">
      <td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Instalación</strong></td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0"></td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right"><strong>${formatQuoteMoney(quote.instalacion.monto, quote.instalacion.currency)}</strong></td>
    </tr>
  ` : '';

  await transporter.sendMail({
    from: `"Sistema AUSAUTH DEV" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `✅ Presupuesto ${quote.numero} ACEPTADO por ${clientName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;border-radius:8px">
        <h2 style="color:#16a34a;border-bottom:3px solid #16a34a;padding-bottom:10px">
          ✅ Presupuesto ACEPTADO
        </h2>
        
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0">
          <p><strong>Nº Presupuesto:</strong> ${quote.numero}</p>
          <p><strong>Cliente:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Teléfono:</strong> ${quote.client?.telefono || 'No disponible'}</p>
        </div>

        <h3 style="color:#334155;margin-top:20px">Detalle del Presupuesto:</h3>
        <table style="width:100%;border-collapse:collapse;background:white">
          <thead>
            <tr style="background:#0f172a;color:white">
              <th style="padding:10px;text-align:left;border-bottom:2px solid #e2e8f0">Producto</th>
              <th style="padding:10px;text-align:right;border-bottom:2px solid #e2e8f0">Cantidad</th>
              <th style="padding:10px;text-align:right;border-bottom:2px solid #e2e8f0">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            ${installationRow}
          </tbody>
        </table>

        <div style="background:#f0f9ff;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #0284c7">
          <h3 style="color:#0284c7;margin-top:0">Totales:</h3>
          ${quote.totales?.USD?.total > 0 ? `<p><strong>USD:</strong> ${formatQuoteMoney(quote.totales.USD.total, 'USD')}</p>` : ''}
          ${quote.totales?.ARS?.total > 0 ? `<p><strong>ARS:</strong> ${formatQuoteMoney(quote.totales.ARS.total, 'ARS')}</p>` : ''}
        </div>

        <p style="color:#475569;font-size:12px;margin-top:20px;border-top:1px solid #e2e8f0;padding-top:15px">
          <strong>⚠️ Próximo paso:</strong> El cliente puede proceder al pago. Una vez aprobado el pago en Mercado Pago, recibirás una notificación de confirmación.
        </p>
      </div>
    `,
  });
};

const sendQuotePaymentConfirmation = async (quote) => {
  const clientName = quote.client?.nombre || 'Cliente';
  const clientEmail = quote.client?.email;

  if (!clientEmail) {
    console.error('❌ Sin email de cliente para presupuesto:', quote.numero);
    return;
  }

  // Formatear items
  const itemsHtml = (quote.items || []).map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${item.nombre}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right">${item.cantidad}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right">${formatQuoteMoney(item.subtotal, item.currency)}</td>
    </tr>
  `).join('');

  const installationRow = quote.instalacion?.incluye ? `
    <tr style="background:#f0f9ff">
      <td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Instalación</strong></td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0"></td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right"><strong>${formatQuoteMoney(quote.instalacion.monto, quote.instalacion.currency)}</strong></td>
    </tr>
  ` : '';

  await transporter.sendMail({
    from: `"AUSAUTH DEV" <${process.env.EMAIL_FROM}>`,
    to: clientEmail,
    subject: `✅ Pago confirmado - Presupuesto ${quote.numero}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;border-radius:8px">
        <h2 style="color:#16a34a;border-bottom:3px solid #16a34a;padding-bottom:10px">
          ✅ ¡Pago Confirmado!
        </h2>
        
        <p style="font-size:16px;color:#334155">Hola ${clientName},</p>
        <p style="color:#475569">Tu pago ha sido procesado exitosamente. Aquí está el detalle de tu presupuesto:</p>

        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #16a34a">
          <p><strong>Nº Presupuesto:</strong> ${quote.numero}</p>
          <p><strong>Fecha de pago:</strong> ${new Date().toLocaleDateString('es-AR')}</p>
          <p><strong>Estado:</strong> <span style="color:#16a34a;font-weight:bold">✅ Pagado</span></p>
        </div>

        <h3 style="color:#334155;margin-top:20px">Detalle:</h3>
        <table style="width:100%;border-collapse:collapse;background:white">
          <thead>
            <tr style="background:#0f172a;color:white">
              <th style="padding:10px;text-align:left">Producto</th>
              <th style="padding:10px;text-align:right">Cantidad</th>
              <th style="padding:10px;text-align:right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            ${installationRow}
          </tbody>
        </table>

        <div style="background:#f0f9ff;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #0284c7">
          <h3 style="color:#0284c7;margin-top:0">Totales:</h3>
          ${quote.totales?.USD?.total > 0 ? `<p><strong>USD:</strong> ${formatQuoteMoney(quote.totales.USD.total, 'USD')}</p>` : ''}
          ${quote.totales?.ARS?.total > 0 ? `<p><strong>ARS:</strong> ${formatQuoteMoney(quote.totales.ARS.total, 'ARS')}</p>` : ''}
        </div>

        <p style="color:#475569;margin-top:20px">Nuestro equipo procesará tu pedido en breve y te contactaremos para confirmar los detalles de entrega.</p>
        
        <p style="color:#64748b;font-size:12px;margin-top:30px;border-top:1px solid #e2e8f0;padding-top:15px">
          <strong>AUSAUTH DEV</strong><br/>
          info@ausauth.com | www.ausauth.com
        </p>
      </div>
    `,
  });
};

const sendQuotePaymentToAdmin = async (quote) => {
  const clientName = quote.client?.nombre || 'Cliente desconocido';
  const clientEmail = quote.client?.email || 'No disponible';

  // Formatear items
  const itemsHtml = (quote.items || []).map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${item.nombre}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right">${item.cantidad}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right">${formatQuoteMoney(item.subtotal, item.currency)}</td>
    </tr>
  `).join('');

  const installationRow = quote.instalacion?.incluye ? `
    <tr style="background:#f0f9ff">
      <td style="padding:8px;border-bottom:1px solid #e2e8f0"><strong>Instalación</strong></td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0"></td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right"><strong>${formatQuoteMoney(quote.instalacion.monto, quote.instalacion.currency)}</strong></td>
    </tr>
  ` : '';

  await transporter.sendMail({
    from: `"Sistema AUSAUTH DEV" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `💰 Presupuesto ${quote.numero} - PAGO APROBADO`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:20px;border-radius:8px">
        <h2 style="color:#059669;border-bottom:3px solid #059669;padding-bottom:10px">
          💰 Pago de Presupuesto Aprobado
        </h2>
        
        <div style="background:white;padding:15px;border-radius:6px;margin:15px 0">
          <p><strong>Nº Presupuesto:</strong> ${quote.numero}</p>
          <p><strong>Cliente:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Teléfono:</strong> ${quote.client?.telefono || 'No disponible'}</p>
          <p><strong>Fecha de pago:</strong> ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR')}</p>
        </div>

        <h3 style="color:#334155;margin-top:20px">Detalle del Presupuesto:</h3>
        <table style="width:100%;border-collapse:collapse;background:white">
          <thead>
            <tr style="background:#0f172a;color:white">
              <th style="padding:10px;text-align:left;border-bottom:2px solid #e2e8f0">Producto</th>
              <th style="padding:10px;text-align:right;border-bottom:2px solid #e2e8f0">Cantidad</th>
              <th style="padding:10px;text-align:right;border-bottom:2px solid #e2e8f0">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            ${installationRow}
          </tbody>
        </table>

        <div style="background:#dcfce7;padding:15px;border-radius:6px;margin:15px 0;border-left:4px solid #059669">
          <h3 style="color:#059669;margin-top:0">Totales Pagados:</h3>
          ${quote.totales?.USD?.total > 0 ? `<p><strong>USD:</strong> ${formatQuoteMoney(quote.totales.USD.total, 'USD')}</p>` : ''}
          ${quote.totales?.ARS?.total > 0 ? `<p><strong>ARS:</strong> ${formatQuoteMoney(quote.totales.ARS.total, 'ARS')}</p>` : ''}
        </div>

        <p style="color:#475569;margin-top:20px"><strong>⚠️ Acción requerida:</strong> Procesa este pedido y prepara el envío del material según lo acordado.</p>
      </div>
    `,
  });
};

module.exports = {
  sendOrderConfirmationToUser,
  sendOrderNotificationToAdmin,
  sendShippingCodeEmail,
  sendQuoteAcceptanceToAdmin,
  sendQuotePaymentConfirmation,
  sendQuotePaymentToAdmin,
};
