import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (senha.length < 6) return alert('Senha deve ter ao menos 6 caracteres');
    if (senha !== confirma) return alert('Senhas não conferem');

    try {
      await register(nome, email, senha);
      navigate('/');
    } catch (err) {
      console.log(err.response || err);
      alert('Erro ao cadastrar');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cadastrar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <Input label="Confirmar senha" type="password" value={confirma} onChange={(e) => setConfirma(e.target.value)} required />
        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
}
