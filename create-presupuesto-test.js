const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2RjNzc5MGY4YzE1MjAwMGU1Nzc3MCIsImlhdCI6MTcyMTE0NzEyMywiZXhwIjoxNzIxMjMzNTIzfQ.LLbkGI1A_k3l-I0N9PpOLMvNBULbLGYl2KtL3IaWqDo';

const presupuesto = {
  cliente: {
    nombre: "Augusto Morán",
    email: "augusto.moran.informatica@gmail.com",
    telefono: "+54 9 11 6839-3582",
    direccion: {
      calle: "Test Street",
      numero: "123",
      codigoPostal: "1111"
    }
  },
  items: [
    {
      producto: "6724f2d03b11df59ac36c1f9",
      nombre: "Router Industrial",
      cantidad: 1,
      precioUnitario: 500,
      currency: "USD"
    }
  ],
  instalacion: {
    incluye: true,
    monto: 200,
    descripcion: "Instalación en sitio",
    currency: "USD"
  }
};

(async () => {
  try {
    // Primero hacer login para obtener token válido
    console.log('🔐 Obteniendo token...');
    const loginRes = await fetch('https://ecommerce-gestion-trabajo.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'augusto@sausansystem.com.ar',
        password: '123456'
      })
    });
    
    const loginData = await loginRes.json();
    if (!loginData.accessToken) {
      console.error('❌ Error en login:', loginData);
      return;
    }
    
    const newToken = loginData.accessToken;
    console.log('✅ Token obtenido:', newToken.substring(0, 20) + '...');
    
    // Crear presupuesto
    const createRes = await fetch('https://ecommerce-gestion-trabajo.onrender.com/api/quotes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${newToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(presupuesto)
    });
    
    const createData = await createRes.json();
    console.log('✅ Presupuesto creado:', createData);
    
    const quoteId = createData._id;
    console.log('📋 ID del presupuesto:', quoteId);
    
    // Enviar por email
    const sendRes = await fetch(`https://ecommerce-gestion-trabajo.onrender.com/api/quotes/${quoteId}/enviar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${newToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    const sendData = await sendRes.json();
    console.log('📧 Presupuesto enviado al email:', sendData);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
