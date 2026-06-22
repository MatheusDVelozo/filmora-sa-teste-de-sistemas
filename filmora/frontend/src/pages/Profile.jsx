import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleUpdate = async () => {
    try {
      await api.put(`/usuarios/${user.id}`, { nome, email });
      alert('Perfil atualizado');
    } catch (err) { alert('Erro ao atualizar'); }
  };

  const handleDelete = async () => {
    if (!confirm('Confirmar exclusão da conta?')) return;
    try {
      await api.delete(`/usuarios/${user.id}`);
      logout();
    } catch (err) { alert('Erro ao excluir conta'); }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Perfil</h2>
      <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="flex gap-2">
        <Button onClick={handleUpdate}>Salvar</Button>
        <button onClick={handleDelete} className="bg-red-700 px-4 py-2 rounded">Excluir conta</button>
      </div>
    </div>
  );
}
