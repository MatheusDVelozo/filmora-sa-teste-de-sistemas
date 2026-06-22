import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import { AuthContext } from '../context/AuthContext';

export default function MovieForm({ edit }) {
  const { id } = useParams();
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [genero, setGenero] = useState('');
  const [duracao, setDuracao] = useState('');
  const [poster, setPoster] = useState('');
  const [sinopse, setSinopse] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (edit && id) {
      api.get(`/filmes/${id}`).then(res => {
        const m = res.data;
        setTitulo(m.titulo); setAno(m.ano); setGenero(m.genero || ''); setDuracao(m.duracao || ''); setPoster(m.poster || ''); setSinopse(m.sinopse || '');
      }).catch(() => alert('Filme não encontrado'));
    }
  }, [edit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { titulo, ano: Number(ano), genero, duracao: duracao ? Number(duracao) : null, poster, sinopse };
      if (edit) {
        await api.put(`/filmes/${id}`, payload);
      } else {
        await api.post('/filmes', payload);
      }
      navigate('/');
    } catch (err) { alert('Erro ao salvar filme'); }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">{edit ? 'Editar Filme' : 'Adicionar Filme'}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        <Input label="Ano" type="number" value={ano} onChange={(e) => setAno(e.target.value)} required />
        <Input label="Gênero" value={genero} onChange={(e) => setGenero(e.target.value)} />
        <Input label="Duração (min)" type="number" value={duracao} onChange={(e) => setDuracao(e.target.value)} />
        <Input label="Poster (URL)" value={poster} onChange={(e) => setPoster(e.target.value)} />
        <label className="block">
          <div className="text-sm text-gray-300 mb-1">Sinopse</div>
          <textarea className="w-full px-3 py-2 rounded bg-gray-800 text-white" value={sinopse} onChange={(e) => setSinopse(e.target.value)} />
        </label>
        <Button type="submit">Salvar</Button>
      </form>
    </div>
  );
}
