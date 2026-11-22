import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router'
import { Shield, User2, Loader2 } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../contexts/AuthContext'
import './login-split.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao fazer login.')
    } finally {
      setLoading(false)
    }
  }

  // Acesso rápido só em DEV, com credenciais do .env.local
  const acessoRapido = async (papel: 'admin' | 'aluno') => {
    const emailVar = papel === 'admin' ? 'VITE_DEV_ADMIN_EMAIL' : 'VITE_DEV_ALUNO_EMAIL'
    const senhaVar = papel === 'admin' ? 'VITE_DEV_ADMIN_SENHA' : 'VITE_DEV_ALUNO_SENHA'
    const e = import.meta.env[emailVar] as string | undefined
    const s = import.meta.env[senhaVar] as string | undefined
    if (!e || !s) {
      setErro(`Configure ${emailVar} e ${senhaVar} no .env.local para usar o acesso rápido.`)
      return
    }
    setErro('')
    setLoading(true)
    try {
      await login(e, s)
      navigate('/')
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro no acesso rápido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lg-page">
      {/* ===== Painel esquerdo / topo no mobile: marca ===== */}
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

      {/* ===== Painel direito / abaixo no mobile: formulário ===== */}
      <section className="lg-form-panel">
        <div className="lg-form-box fade-in-up">
          <p className="lg-eyebrow">
            <span className="lg-eyebrow-line" /> Acesso ao sistema
          </p>
          <h1 className="lg-title font-display">Bem-vindo de volta</h1>
          <p className="lg-lead">Entre com seu e-mail e senha para acessar o painel.</p>

          {erro && (
            <div className="alert alert-danger p-2 mb-3" style={{ fontSize: '0.875rem' }}>
              {erro}
            </div>
          )}

          <form onSubmit={submit} className="d-flex flex-column gap-3">
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
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                id="password"
                type="password"
                required
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.875rem' }}>
              <Link to="/esqueci-senha" className="text-primary text-decoration-none">
                Esqueceu a senha?
              </Link>
              <Link to="/cadastro" className="text-primary text-decoration-none">
                Criar conta
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-glow lg-submit w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 size={16} className="spin" />}
              Entrar
            </button>
          </form>

          {/* Acesso rápido só em DEV */}
          {import.meta.env.DEV && (
            <>
              <div className="login-divider my-4">
                <span /> Acesso rápido (DEV) <span />
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-quick w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => acessoRapido('admin')}
                    disabled={loading}
                  >
                    <Shield size={16} /> Admin
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-quick w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => acessoRapido('aluno')}
                    disabled={loading}
                  >
                    <User2 size={16} /> Aluno
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
