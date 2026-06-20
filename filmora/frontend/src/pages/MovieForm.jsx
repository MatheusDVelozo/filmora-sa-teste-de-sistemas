import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

export default function MovieForm({ edit }) {
  

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {edit ? 'Editar Filme' : 'Adicionar Filme'}
      </h2>

      <form className="space-y-3">
        <Input
          label="Título"
          required
        />

        <Input
          label="Ano"
          type="number"
          required
        />

        <Input
          label="Gênero"
        />

        <Input
          label="Duração (min)"
          type="number"
        />

        <Input
          label="Poster (URL)"
        />

        <label className="block">
          <div className="text-sm text-gray-300 mb-1">
            Sinopse
          </div>

          <textarea
            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
          />
        </label>

        <Button type="submit">
          Salvar
        </Button>
      </form>
    </div>
  );
}