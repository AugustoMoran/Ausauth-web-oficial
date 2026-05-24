const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test User ID (cambiar con un ID real de la BD)
const TEST_CLIENT_ID = ''; // Se obtiene dinámicamente
const TEST_ADMIN_ID = ''; // Se obtiene dinámicamente
let authToken = '';

async function testRecommendations() {
  try {
    console.log('🧪 Iniciando test de recomendaciones...\n');

    // 1. Obtener lista de usuarios para encontrar cliente y admin
    console.log('📋 Obteniendo lista de usuarios...');
    const usersRes = await axios.get(`${API_BASE}/users/list`);
    const users = usersRes.data.users;
    
    // Encontrar un usuario cliente y un admin
    const clientUser = users.find(u => u.role === 'user');
    const adminUser = users.find(u => u.role === 'admin');
    
    if (!clientUser) {
      console.error('❌ No se encontró un usuario cliente');
      return;
    }
    
    if (!adminUser) {
      console.error('❌ No se encontró un usuario admin');
      return;
    }

    console.log(`✅ Cliente encontrado: ${clientUser.nombre} ${clientUser.apellido} (${clientUser._id})`);
    console.log(`✅ Admin encontrado: ${adminUser.nombre} ${adminUser.apellido} (${adminUser._id})\n`);

    // 2. Obtener lista de productos
    console.log('📦 Obteniendo productos...');
    const productsRes = await axios.get(`${API_BASE}/products?limit=5`);
    const products = productsRes.data.data.filter(p => p.isActive);
    
    if (products.length < 2) {
      console.error('❌ No hay productos activos suficientes');
      return;
    }

    const productIds = products.slice(0, 2).map(p => p._id);
    console.log(`✅ Productos encontrados: ${productIds.length} productos\n`);

    // 3. Login como admin
    console.log('🔐 Intentando login como admin...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: adminUser.email,
      password: 'Sgsgsgs1.', // Cambiar con la contraseña real
    });
    
    authToken = loginRes.data.accessToken;
    const adminId = loginRes.data.user._id;
    console.log(`✅ Login exitoso. Token obtenido.\n`);

    // 4. Crear recomendación
    console.log('💌 Creando recomendación...');
    const createRes = await axios.post(
      `${API_BASE}/admin/recommendations`,
      {
        clientId: clientUser._id,
        productIds: productIds,
        message: 'Te recomendamos estos productos especialmente para ti',
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log(`✅ Recomendación creada exitosamente:`);
    console.log(JSON.stringify(createRes.data, null, 2));

    // 5. Obtener recomendaciones
    console.log('\n📊 Obteniendo recomendaciones...');
    const getRes = await axios.get(
      `${API_BASE}/admin/recommendations`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log(`✅ Recomendaciones obtenidas:`);
    console.log(JSON.stringify(getRes.data, null, 2));

    // 6. Obtener stats
    console.log('\n📈 Obteniendo estadísticas...');
    const statsRes = await axios.get(
      `${API_BASE}/admin/recommendations/stats`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log(`✅ Estadísticas:`);
    console.log(JSON.stringify(statsRes.data, null, 2));

    console.log('\n✅ Todos los tests pasaron correctamente!');
  } catch (error) {
    console.error('\n❌ Error durante el test:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testRecommendations();
