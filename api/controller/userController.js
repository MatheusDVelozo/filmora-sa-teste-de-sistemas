import * as userServices from '../services/userServices.js';

export const getUsers = async (req, res) => {
  try {
    const users = await userServices.listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userServices.findUserById(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
    if (!senha || senha.length < 6) return res.status(400).json({ error: 'Senha deve ter ao menos 6 caracteres' });

    const existing = await userServices.findUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email já existe' });

    const user = await userServices.createUser({ nome, email, senha });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { nome, email, senha } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
    if (senha && senha.length < 6) return res.status(400).json({ error: 'Senha deve ter ao menos 6 caracteres' });

    const existing = await userServices.findUserByEmail(email);
    if (existing && existing.id !== Number(id)) return res.status(400).json({ error: 'Email já existe' });

    const user = await userServices.updateUser(id, { nome, email, senha });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userServices.deleteUser(id);
    res.json({ message: 'Usuário deletado' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
