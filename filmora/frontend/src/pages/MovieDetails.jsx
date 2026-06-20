import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function MovieDetails() {
    const navigate = useNavigate();

    const movie = {
        id: 1,
        titulo: 'Interestelar',
        ano: 2014,
        genero: 'Ficção Científica',
        duracao: 169,
        sinopse:
            'Uma equipe de exploradores viaja através de um buraco de minhoca para garantir a sobrevivência da humanidade.',
        poster: 'https://m.media-amazon.com/images/I/91obuWzA3XL._AC_SY879_.jpg',
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-4">
                {movie.poster ? (<img src={movie.poster} alt={movie.titulo} className="w-full md:w-1/3 h-auto object-cover rounded" />
                ) : (<div className="w-full md:w-1/3 h-64 bg-gray-700 flex items-center justify-center rounded">No Image</div>)}
                <div>
                    <h1 className="text-3xl font-bold">{movie.titulo}</h1>
                    <p className="text-gray-500">{movie.ano} • {movie.genero} • {movie.duracao} min</p>
                    <p className="mt-4">{movie.sinopse}</p>
                    <div className="mt-4 flex gap-2">
                        <Link to={`/filmes/editar/${movie.id}`} className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">Editar</Link>
                        <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Excluir</button>
                    </div>
                </div>
            </div>
        </div>
    );
}