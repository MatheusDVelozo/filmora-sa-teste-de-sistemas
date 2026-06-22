import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (search) => {
    setLoading(true);
    const res = await api.get('/filmes' + (search ? `?search=${encodeURIComponent(search)}` : ''));
    setMovies(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(q);
  };

  return (
    <div>
      <SearchBar value={q} onChange={setQ} onSubmit={handleSearch} />
      {loading ? <Loading /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {movies.map(m => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </div>
  );
}
