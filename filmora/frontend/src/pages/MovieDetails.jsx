import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { AuthContext } from '../context/AuthContext';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get(`/filmes/${id}`).then(res => setMovie(res.data)).catch(() => alert('Filme não encontrado'));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Confirmar exclusão do filme?')) return;
    try {
      await api.delete(`/filmes/${id}`);
      navigate('/');
    } catch (err) { alert('Erro ao excluir'); }
  };

  if (!movie) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        {movie.poster ? <img src={movie.poster} className="w-full md:w-1/3 h-auto object-cover" /> : <div className="w-full md:w-1/3 h-64 bg-gray-700 flex items-center justify-center">No Image</div>}
        <div>
          <h1 className="text-3xl font-bold">{movie.titulo}</h1>
          <p className="text-gray-300">{movie.ano} • {movie.genero} • {movie.duracao} min</p>
          <p className="mt-4">{movie.sinopse}</p>

          <div className="mt-4 flex gap-2">
            {user && user.nome === 'admin' && user.email === 'admin@admin' && (
              <>
                <Link to={`/filmes/editar/${movie.id}`} className="bg-yellow-700 px-3 py-1 rounded">Editar</Link>
                <button onClick={handleDelete} className="bg-red-700 px-3 py-1 rounded">Excluir</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
