import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-green-400">FILMORA</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-200">Home</Link>
          {user ? (
            <>
              <Link to="/perfil" className="text-gray-200">Perfil</Link>
              {user.nome === 'admin' && user.email === 'admin@admin' && (
                <Link to="/filmes/novo">
                  <Button>+ Adicionar Filme</Button>
                </Link>
              )}
              <button onClick={logout} className="bg-red-700 px-3 py-1 rounded">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-200">Entrar</Link>
              <Link to="/cadastro" className="text-gray-200">Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
