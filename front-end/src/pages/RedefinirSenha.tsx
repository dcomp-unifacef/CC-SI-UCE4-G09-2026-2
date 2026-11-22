import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Logo from '../components/Logo'
import { authApi } from '../services/api'
import './login-split.css'

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') ?? ''

  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!token) setErro('Link inválido ou expirado.')
  }, [token])

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
      await authApi.redefinirSenha(token, senha)
      setSucesso(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao redefinir senha.')
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
            <span className="lg-eyebrow-line" /> Redefinição de senha
          </p>
          <h1 className="lg-title font-display">Nova senha</h1>

          {sucesso ? (
            <div className="text-center">
              <div className="d-flex justify-content-center mb-3">
                <CheckCircle2 size={64} className="text-success" />
              </div>
              <p className="mb-3" style={{ fontSize: '0.9375rem' }}>
                Senha redefinida com sucesso! Redirecionando ao login...
              </p>
            </div>
          ) : !token ? (
            <div className="text-center">
              <div className="d-flex justify-content-center mb-3">
                <XCircle size={64} className="text-danger" />
              </div>
              <p className="mb-3" style={{ fontSize: '0.9375rem' }}>
                Link inválido ou expirado.
              </p>
            </div>
          ) : (
            <>
              <p className="lg-lead">Escolha uma nova senha forte.</p>

              {erro && (
                <div className="alert alert-danger p-2 mb-3" style={{ fontSize: '0.875rem' }}>
                  {erro}
                </div>
              )}

              <form onSubmit={submit} className="d-flex flex-column gap-3">
                <div>
                  <label htmlFor="senha" className="form-label">Nova senha (mínimo 8 caracteres)</label>
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
                  Redefinir senha
                </button>
              </form>
            </>
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
