import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Profile() {
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Perfil</h2>

      <Input
        label="Nome"
        value="Nome do usuário"
      />

      <Input
        label="Email"
        value="Email do usuário"
      />

      <div className="flex gap-2">
        <Button>Salvar</Button>

        <button className="bg-red-700 px-4 py-2 rounded">
          Excluir conta
        </button>
      </div>
    </div>
  );
}