/**
 * Initialize Mercado Pago SDK
 * Waits for SDK to load before initializing
 */
export const initializeMercadoPago = () => {
  const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
  
  if (!publicKey) {
    console.warn('⚠️ VITE_MP_PUBLIC_KEY not configured. Mercado Pago checkout will not work.');
    return;
  }

  // Wait for SDK to load (max 15 attempts = 7.5s for production delays)
  let attempts = 0;
  const maxAttempts = 15;
  
  const initialize = () => {
    // Check for window.MercadoPago (SDK v2) or window.mp (legacy)
    if (typeof window.MercadoPago !== 'undefined' || typeof window.mp !== 'undefined') {
      const mp = window.MercadoPago || window.mp;
      try {
        if (typeof mp.bricks !== 'undefined') {
          // SDK v2 with Bricks
        } else if (typeof mp.checkout !== 'undefined') {
          // Legacy checkout
        }
      } catch (error) {
        console.error('❌ Error initializing MP SDK:', error);
      }
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(initialize, 500);
    } else {
      console.warn('⚠️ Mercado Pago SDK did not load after 7.5s. Check network and index.html');
    }
  };

  initialize();
};
