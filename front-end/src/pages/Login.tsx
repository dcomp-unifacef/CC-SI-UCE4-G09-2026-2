import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Shield, User2, Loader2 } from 'lucide-react'
import Logo from '../components/Logo'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Por enquanto: só navega para a home, sem autenticar.
  const submit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 300)
  }

  return (
    <div className="login-bg">
      <div className="login-glow login-glow-top" />
      <div className="login-glow login-glow-bottom" />

      <div className="login-center">
        <div className="w-100 fade-in-up" style={{ maxWidth: '28rem' }}>
          {/* Logo + título */}
          <div className="mb-4 d-flex flex-column align-items-center gap-2">
            <Logo size={72} />
            <p className="font-display login-title mb-0">ELITE FIGHT CLUB</p>
            <p className="login-subtitle mb-0">Disciplina · Força · Evolução</p>
          </div>

          {/* Card glass */}
          <div className="login-card">
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
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-glow w-100 d-flex align-items-center justify-content-center gap-2"
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

            {/* Acesso rápido — por enquanto só navegam para a home */}
            <div className="row g-2">
              <div className="col-6">
                <button
                  className="btn btn-quick w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/')}
                >
                  <Shield size={16} /> Admin
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-quick w-100 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/')}
                >
                  <User2 size={16} /> Aluno
                </button>
              </div>
            </div>
          </div>

          <p className="login-footer text-center mt-4 mb-0">Sistema de gestão · v2 mock</p>
        </div>
      </div>
    </div>
  )
}
