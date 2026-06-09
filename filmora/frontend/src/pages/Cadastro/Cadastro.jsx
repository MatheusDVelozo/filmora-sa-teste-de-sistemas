import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../contexts/AuthContext'
import { validarEmail, validarSenha } from '../../utils/validador'

export default function Cadastro(){
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { loginFake } = useAuth()
  const nav = useNavigate()

  function submit(e){
    e.preventDefault()
    if(!nome) return setErro('Informe seu nome')
    if(!validarEmail(email)) return setErro('Email inválido')
    if(!validarSenha(senha)) return setErro('Senha fraca')
    loginFake({ nome, email })
    nav('/catalogo')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold">Criar conta</h2>
        <form onSubmit={submit} className="max-w-md mt-4 space-y-3">
          <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome" className="w-full p-2 bg-[var(--glass)] rounded" />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 bg-[var(--glass)] rounded" />
          <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha" className="w-full p-2 bg-[var(--glass)] rounded" />
          {erro && <div className="text-sm text-rose-400">{erro}</div>}
          <button className="px-4 py-2 bg-[var(--accent)] rounded">Criar</button>
        </form>
      </main>
    </div>
  )
}
