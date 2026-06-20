import { createUser, findUserByEmail } from '../services/userServices.js';
import { authenticateUser } from '../services/authServices.js';

export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
    if (!senha || senha.length < 6) return res.status(400).json({ error: 'Senha deve ter ao menos 6 caracteres' });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email já existe' });

    const user = await createUser({ nome, email, senha });
    const auth = await authenticateUser(email, senha);
    res.status(201).json(auth);
  } catch (err) {

    console.log(err)
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    const auth = await authenticateUser(email, senha);
    if (!auth) return res.status(401).json({ error: 'Credenciais inválidas' });

    res.json(auth);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const me = async (req, res) => {
  res.json(req.user);
};
