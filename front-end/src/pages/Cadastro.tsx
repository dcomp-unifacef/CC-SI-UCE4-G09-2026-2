import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router'
import { Loader2 } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../contexts/AuthContext'
import './login-split.css'

export default function Cadastro() {
  const navigate = useNavigate()
  const { cadastrar } = useAuth()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')

    if (senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres.')
      return
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      await cadastrar(nome, email, senha)
      navigate('/')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao criar conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lg-page">
      <section className="lg-brand">
        <div className="lg-hex" />
        <div className="lg-brand-inner">
          <div className="lg-logo-wrap">
            <span className="lg-ring lg-ring-1" />
            <span className="lg-ring lg-ring-2" />
            <Logo size={470} />
          </div>
          <p className="lg-tagline font-display">
            <span>Disciplina</span>
            <i className="lg-dot" />
            <span>Força</span>
            <i className="lg-dot" />
            <span>Evolução</span>
          </p>
        </div>
      </section>

      <section className="lg-form-panel">
        <div className="lg-form-box fade-in-up">
          <p className="lg-eyebrow">
            <span className="lg-eyebrow-line" /> Cadastro
          </p>
          <h1 className="lg-title font-display">Crie sua conta</h1>
          <p className="lg-lead">Preencha os campos abaixo para começar.</p>

          {erro && (
            <div className="alert alert-danger p-2 mb-3" style={{ fontSize: '0.875rem' }}>
              {erro}
            </div>
          )}

          <form onSubmit={submit} className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="nome" className="form-label">Nome completo</label>
              <input
                id="nome"
                type="text"
                required
                className="form-control"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email" className="form-label">E-mail</label>
              <input
                id="email"
                type="email"
                required
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="senha" className="form-label">Senha (mínimo 8 caracteres)</label>
              <input
                id="senha"
                type="password"
                required
                minLength={8}
                className="form-control"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirmar" className="form-label">Confirme a senha</label>
              <input
                id="confirmar"
                type="password"
                required
                minLength={8}
                className="form-control"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-glow lg-submit w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 size={16} className="spin" />}
              Criar conta
            </button>
          </form>

          <div className="text-center mt-3" style={{ fontSize: '0.875rem' }}>
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary text-decoration-none">
              Fazer login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
