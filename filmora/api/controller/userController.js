import { pool } from "../db/db.js";
import { validateUser } from "../services/userServices.js";

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const createUser = async (req, res) => {
  try {
    validateUser(req.body);

    const { name, email, password } = req.body;

    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const [result] = await pool.query(query, [name, email, password]);

    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario não encontrado" });
    }

    res.json({ message: "Usuario excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    validateUser(req.body);

    const { name, email, password } = req.body;

    const query = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
    const [result] = await pool.query(query, [name, email, password, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario não encontrado" });
    }

    res.json({ message: "Usuario atualizado com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
