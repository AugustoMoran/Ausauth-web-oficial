import config from '../frontend/src/config/app';

const BASE_URL = config.apiUrl;

export async function sendChatMessage(message, sessionId, conversationHistory = []) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ message, sessionId, conversationHistory }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Error al conectar con el asistente.');
  }

  return res.json();
}
