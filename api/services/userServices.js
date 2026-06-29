import { pool } from '../db/postgres.js';
import bcrypt from 'bcrypt';

export const findUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const { rows } = await pool.query('SELECT id, nome, email, created_at FROM usuarios WHERE id = $1', [id]);
  return rows[0];
};

export const createUser = async ({ nome, email, senha }) => {
  const hashed = await bcrypt.hash(senha, 10);
  const { rows } = await pool.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, created_at',
    [nome, email, hashed]
  );
  return rows[0];
};

export const updateUser = async (id, { nome, email, senha }) => {
  if (senha) {
    senha = await bcrypt.hash(senha, 10);
    await pool.query('UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4', [nome, email, senha, id]);
  } else {
    await pool.query('UPDATE usuarios SET nome = $1, email = $2 WHERE id = $3', [nome, email, id]);
  }
  return findUserById(id);
};

export const deleteUser = async (id) => {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  return;
};

export const listUsers = async () => {
  const { rows } = await pool.query('SELECT id, nome, email, created_at FROM usuarios ORDER BY id');
  return rows;
};
