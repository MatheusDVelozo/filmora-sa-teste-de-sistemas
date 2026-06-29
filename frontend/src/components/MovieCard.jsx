import React from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <div className="bg-gray-800 rounded overflow-hidden shadow">
      {movie.poster ? (
        <img src={movie.poster} alt={movie.titulo} className="w-full h-56 object-cover" />
      ) : (
        <div className="w-full h-56 bg-gray-700 flex items-center justify-center">No Image</div>
      )}
      <div className="p-3">
        <h3 className="text-lg font-semibold">{movie.titulo}</h3>
        <p className="text-sm text-gray-300">{movie.ano} • {movie.genero}</p>
        <div className="mt-3 flex justify-between items-center">
          <Link to={`/filmes/${movie.id}`} className="text-green-300">Ver</Link>
        </div>
      </div>
    </div>
  );
}
