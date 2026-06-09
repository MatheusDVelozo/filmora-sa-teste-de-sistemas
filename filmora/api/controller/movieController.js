import { pool } from "../db/db.js";
import { validateMovie } from "../services/movieServices.js";

export const getAllMovies = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM movies");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const createMovie = async (req, res) => {
    try {
        validateMovie(req.body);

        const { title, sinopse, release_date } = req.body;

        const query = "INSERT INTO movies (title, sinopse, release_date) VALUES (?, ?, ?)";
        const [result] = await pool.query(query, [title, sinopse, release_date]);

        res.status(201).json({ id: result.insertId, title, sinopse, release_date });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteMovie = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query("DELETE FROM movies WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Filme não encontrado" });
        }

        res.json({ message: "Filme excluído com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateMovie = async (req, res) => {
    const { id } = req.params;
    try {
        validateMovie(req.body);

        const { title, sinopse, release_date } = req.body;

        const query = "UPDATE movies SET title = ?, sinopse = ?, release_date = ? WHERE id = ?";
        const [result] = await pool.query(query, [title, sinopse, release_date, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Filme não encontrado" });
        }

        res.json({ message: "Filme atualizado com sucesso" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
