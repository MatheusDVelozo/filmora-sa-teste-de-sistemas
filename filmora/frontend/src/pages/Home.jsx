import React, { useEffect, useState } from 'react';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';

export default function Home() {

  return (
    <div>
      <SearchBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* <MovieCard />
        <MovieCard />
        <MovieCard /> */}
      </div>
    </div>
  );
}


