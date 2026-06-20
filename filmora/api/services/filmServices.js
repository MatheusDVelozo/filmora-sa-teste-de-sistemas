import { pool } from '../db/postgres.js';

export const validateFilm = (film) => {
  if (!film.titulo || !film.titulo.trim()) throw new Error('Título é obrigatório');
  const year = Number(film.ano);
  if (!Number.isInteger(year) || year < 1888 || year > new Date().getFullYear()) throw new Error('Ano inválido');
  return true;
};

export const createFilm = async (film, usuario_id) => {
  const { rows } = await pool.query(
    `INSERT INTO filmes (titulo, ano, genero, duracao, poster, sinopse, usuario_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [film.titulo, film.ano, film.genero || null, film.duracao || null, film.poster || null, film.sinopse || null, usuario_id]
  );
  return rows[0];
};

export const updateFilm = async (id, film, usuario_id) => {
  const { rows: existing } = await pool.query('SELECT * FROM filmes WHERE id = $1', [id]);
  if (existing.length === 0) throw { status: 404, message: 'Filme não encontrado' };
  if (existing[0].usuario_id !== usuario_id) throw { status: 403, message: 'Sem permissão' };

  const { rows } = await pool.query(
    `UPDATE filmes SET titulo=$1, ano=$2, genero=$3, duracao=$4, poster=$5, sinopse=$6 WHERE id=$7 RETURNING *`,
    [film.titulo, film.ano, film.genero || null, film.duracao || null, film.poster || null, film.sinopse || null, id]
  );
  return rows[0];
};

export const deleteFilm = async (id, usuario_id) => {
  const { rows: existing } = await pool.query('SELECT * FROM filmes WHERE id = $1', [id]);
  if (existing.length === 0) throw { status: 404, message: 'Filme não encontrado' };
  if (existing[0].usuario_id !== usuario_id) throw { status: 403, message: 'Sem permissão' };

  await pool.query('DELETE FROM filmes WHERE id = $1', [id]);
  return;
};

export const getFilmById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM filmes WHERE id = $1', [id]);
  return rows[0];
};

export const listFilms = async (search) => {
  if (search) {
    const q = `%${search}%`;
    const { rows } = await pool.query('SELECT * FROM filmes WHERE LOWER(titulo) LIKE LOWER($1) ORDER BY id', [q]);
    return rows;
  }
  const { rows } = await pool.query('SELECT * FROM filmes ORDER BY id');
  return rows;
};
