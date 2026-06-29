import * as filmServices from '../services/filmServices.js';

export const listFilms = async (req, res) => {
  try {
    const { search } = req.query;
    const films = await filmServices.listFilms(search);
    res.json(films);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFilm = async (req, res) => {
  try {
    const film = await filmServices.getFilmById(req.params.id);
    if (!film) return res.status(404).json({ error: 'Filme não encontrado' });
    res.json(film);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createFilm = async (req, res) => {
  try {
    filmServices.validateFilm(req.body);
    const film = await filmServices.createFilm(req.body, req.user.id);
    res.status(201).json(film);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    res.status(400).json({ error: err.message });
  }
};

export const updateFilm = async (req, res) => {
  try {
    filmServices.validateFilm(req.body);
    const film = await filmServices.updateFilm(req.params.id, req.body, req.user.id);
    res.json(film);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    res.status(400).json({ error: err.message });
  }
};

export const deleteFilm = async (req, res) => {
  try {
    await filmServices.deleteFilm(req.params.id, req.user.id);
    res.json({ message: 'Filme deletado' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    res.status(500).json({ error: 'Internal server error' });
  }
};
