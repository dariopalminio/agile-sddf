/**
 * client.js - Código de frontend de ejemplo con vulnerabilidades de seguridad intencionales.
 *
 * Este archivo contiene INTENCIONALMENTE:
 *   - SEC-003: Token JWT almacenado en localStorage (HIGH)
 *
 * NO usar en producción.
 */

async function login(username, password) {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();

  if (response.ok) {
    // SEC-003: HIGH — token JWT almacenado en localStorage (vulnerable a XSS)
    localStorage.setItem('token', data.token);
    localStorage.setItem('jwt', data.token);

    console.log('Login exitoso, token guardado en localStorage');
    return data.token;
  } else {
    throw new Error(data.error);
  }
}

async function getProfile() {
  // Recupera el token desde localStorage
  const token = localStorage.getItem('token');

  const response = await fetch('/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.json();
}

module.exports = { login, getProfile };
