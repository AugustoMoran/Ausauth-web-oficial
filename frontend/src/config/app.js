/**
 * Centralized frontend configuration.
 *
 * All VITE_ environment variables are read here once.
 * Import from this file instead of using import.meta.env directly across components.
 *
 * To customize for a new client, only the .env.local file needs to change.
 */

const config = {
  // API
  apiUrl: import.meta.env.VITE_API_URL || '/api',

  // Store branding
  storeName: import.meta.env.VITE_STORE_NAME || 'Ausauth',

  // Social media / contact (random defaults until configured)
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '5491168393582',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/ausauth.dev/',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'augusto.moran.informatica@gmail.com',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || '+54 9 11 6839-3582',

  // Logo (optional - null if not configured)
  logoUrl: import.meta.env.VITE_LOGO_URL || '/logo3d.png',
  headerLogoUrl: '/logo1.png',
  footerLogoUrl: '/logo3d.png',
  faviconUrl: '/logo2.png',
};

export default config;
