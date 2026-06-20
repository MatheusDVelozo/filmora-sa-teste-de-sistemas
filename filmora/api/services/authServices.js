import { findUserByEmail } from './userServices.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateUser = async (email, senha) => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(senha, user.senha);
  if (!match) return null;

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

  return { token, user: { id: user.id, nome: user.nome, email: user.email, created_at: user.created_at } };
};
