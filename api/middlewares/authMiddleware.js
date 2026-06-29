import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../db/postgres.js';

dotenv.config();

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request
    const { rows } = await pool.query('SELECT id, nome, email, created_at FROM usuarios WHERE id = $1', [payload.id]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid token user' });

    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const isAdmin = (req, res, next) => {
  // authenticate middleware must run before isAdmin
  if (!req.user) return res.status(401).json({ error: 'Invalid token' });
  const { nome, email } = req.user;
  if (nome === 'admin' && email === 'admin@admin') return next();
  return res.status(403).json({ message: 'Apenas administradores podem realizar esta ação.' });
};
