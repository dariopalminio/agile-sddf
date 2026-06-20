/**
 * auth.js - Módulo de autenticación de ejemplo para verificar las reglas de seguridad JWT.
 *
 * Este archivo contiene INTENCIONALMENTE vulnerabilidades de seguridad para que el
 * skill security-audit detecte hallazgos FAIL en los siguientes escenarios (AC-1):
 *   - SEC-002: Secreto JWT hardcodeado (CRITICAL)
 *   - SEC-003: Token JWT almacenado en localStorage (HIGH)
 *   - SEC-004: jwt.sign() sin expiresIn (MEDIUM)
 *
 * NO usar este archivo en producción.
 */

const jwt = require('jsonwebtoken');
const express = require('express');

// SEC-002: CRÍTICO — secreto hardcodeado en código fuente
const JWT_SECRET = 'my-super-secret-key-hardcoded-here';

const app = express();
app.use(express.json());

/**
 * Login endpoint — genera un token JWT con vulnerabilidades intencionales.
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin123') {
    // SEC-004: MEDIUM — jwt.sign() sin expiresIn
    const token = jwt.sign({ userId: 1, username }, JWT_SECRET);

    res.json({ token, message: 'Login exitoso' });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

/**
 * Verify endpoint — verifica el token JWT.
 */
app.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

/**
 * Profile endpoint — ejemplo de endpoint protegido.
 */
app.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  const user = jwt.verify(token, JWT_SECRET);
  res.json({ profile: user });
});

module.exports = app;
