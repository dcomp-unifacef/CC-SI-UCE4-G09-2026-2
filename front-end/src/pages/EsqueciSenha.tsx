import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { Loader2, CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo'
import { authApi } from '../services/api'
import './login-split.css'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      await authApi.esqueciSenha(email)
      setEnviado(true)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao solicitar recuperação.')
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
            <span className="lg-eyebrow-line" /> Recuperação de senha
          </p>
          <h1 className="lg-title font-display">Esqueceu a senha?</h1>
          {!enviado ? (
            <>
              <p className="lg-lead">
                Informe seu e-mail e enviaremos as instruções para redefinir sua senha.
              </p>

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

                <button
                  type="submit"
                  className="btn btn-primary btn-glow lg-submit w-100 d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading && <Loader2 size={16} className="spin" />}
                  Enviar instruções
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="d-flex justify-content-center mb-3">
                <CheckCircle2 size={64} className="text-success" />
              </div>
              <p className="mb-3" style={{ fontSize: '0.9375rem' }}>
                Se o e-mail estiver cadastrado, enviaremos as instruções para redefinir sua senha.
              </p>
            </div>
          )}

          <div className="text-center mt-3" style={{ fontSize: '0.875rem' }}>
            <Link to="/login" className="text-primary text-decoration-none">
              Voltar ao login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
