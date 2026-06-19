import React from 'react';

export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-4">
      <input
        className="flex-1 px-3 py-2 rounded bg-gray-800 text-white"
        placeholder="Pesquisar títulos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="submit" className="bg-green-800 px-4 py-2 rounded">Buscar</button>
    </form>
  );
}
