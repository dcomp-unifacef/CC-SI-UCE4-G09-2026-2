import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Shield, User2, Loader2 } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../contexts/AuthContext'
import './login-split.css'

// Se preferir usar a logo P&B nova como imagem, salve em src/assets/logo-elite-bw.png,
// descomente o import abaixo e troque <Logo ... /> por <img ... /> (veja comentário no JSX).
import logoBw from '../assets/logo-elite.png'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, loginAs } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Autentica via mock (admin se e-mail contiver "admin", senão aluno)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await signIn(email, password)
    setLoading(false)
    navigate('/')
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
            {/* Para usar a imagem P&B: <img src={logoBw} alt="Elite Fight Club" className="lg-logo-img" /> */}
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
            <button
              type="submit"
              className="btn btn-primary btn-glow lg-submit w-100 d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 size={16} className="spin" />}
              Entrar
            </button>
          </form>

          {/* Divisor "Acesso rápido" */}
          <div className="login-divider my-4">
            <span /> Acesso rápido <span />
          </div>

          {/* Acesso rápido — entra diretamente como admin ou aluno */}
          <div className="row g-2">
            <div className="col-6">
              <button
                type="button"
                className="btn btn-quick w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => { loginAs('admin'); navigate('/') }}
              >
                <Shield size={16} /> Admin
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                className="btn btn-quick w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => { loginAs('aluno'); navigate('/') }}
              >
                <User2 size={16} /> Aluno
              </button>
            </div>
          </div>

          <p className="login-footer text-center mt-5 mb-0">Sistema de gestão · v2 mock</p>
        </div>
      </section>
    </div>
  )
}
