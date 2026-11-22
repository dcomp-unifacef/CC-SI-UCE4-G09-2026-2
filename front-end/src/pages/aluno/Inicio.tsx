import { useEffect, useState } from 'react'
import { Calendar, Flame, Wallet, ClipboardCheck, Loader2 } from 'lucide-react'
import { alunoMeApi } from '../../services/api'
import type { AlunoMeAPI, AulaAPI, FinanceiroAPI, PresencaAPI } from '../../services/api'
import FaixaBadge from '../../components/FaixaBadge'
import StatusBadge from '../../components/StatusBadge'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const MODALIDADE_COLORS: Record<string, string> = {
  Boxe: '#f87171',
  'Muay Thai': '#fbbf24',
  'Jiu-Jitsu': '#60a5fa',
  Funcional: '#4ade80',
}

interface Estado {
  aluno: AlunoMeAPI | null
  aulas: AulaAPI[]
  financeiro: FinanceiroAPI[]
  presencas: PresencaAPI[]
}

export default function AlunoInicio() {
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [dados, setDados] = useState<Estado>({
    aluno: null,
    aulas: [],
    financeiro: [],
    presencas: [],
  })

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErro(null)
      try {
        const [aluno, aulas, financeiro, presencas] = await Promise.all([
          alunoMeApi.obterPerfil(),
          alunoMeApi.obterAulas(),
          alunoMeApi.obterFinanceiro(),
          alunoMeApi.obterFrequencia(),
        ])
        setDados({ aluno, aulas, financeiro, presencas })
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <Loader2 size={32} className="spin" style={{ color: '#6c7f8e' }} />
      </div>
    )
  }

  if (erro) {
    return (
      <div className="card-elevated p-4" style={{ border: '1px solid rgba(248,113,113,.3)' }}>
        <p style={{ color: '#f87171', marginBottom: 0 }}>{erro}</p>
      </div>
    )
  }

  const { aluno, aulas, financeiro, presencas } = dados

  if (!aluno) return null

  const initials = aluno.nome.split(' ').slice(0, 2).map((n) => n[0]).join('')
  const statusVal = aluno.status === 'ATIVO' ? 'ativo'
    : aluno.status === 'INADIMPLENTE' ? 'inadimplente'
    : 'inativo'

  // Próximas 4 aulas
  const proximas = aulas.slice(0, 4)

  // Pagamentos pendentes
  const pendentes = financeiro.filter((f) => f.status !== 'pago').length

  // Últimas 5 presenças
  const ultimas = presencas.slice(0, 5)
  console.log("[DEBUG Início] Presenças do aluno:", presencas.length, presencas)

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Bem-vindo</p>
        <h1 className="page-title">OLÁ, {aluno.nome.split(' ')[0].toUpperCase()}</h1>
        <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>
          Bom treino hoje. Mantenha o ritmo.
        </p>
      </header>

      {/* Card perfil */}
      <div className="card-elevated p-4">
        <div className="d-flex flex-wrap align-items-center gap-4">
          <div
            className="avatar-initials flex-shrink-0"
            style={{
              width: 64, height: 64,
              fontSize: '1.375rem',
              background: 'rgba(108,127,142,.15)',
              color: '#6c7f8e',
            }}
          >
            {initials}
          </div>
          <div className="flex-fill">
            <p className="fw-semibold mb-1" style={{ fontSize: '1.0625rem' }}>{aluno.nome}</p>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <FaixaBadge faixa={aluno.graduacao as any} showBar={false} />
              {aluno.modalidades.map((m) => (
                <span
                  key={m}
                  className="rounded-pill px-2 py-1"
                  style={{
                    background: `${MODALIDADE_COLORS[m] ?? '#6c7f8e'}22`,
                    color: MODALIDADE_COLORS[m] ?? '#6c7f8e',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <StatusBadge status={statusVal} />
        </div>
      </div>

      {/* Mini-cards */}
      <div className="row g-3">
        <div className="col-sm-4">
          <div className="card-elevated p-4 d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
              style={{ width: 40, height: 40, background: 'rgba(108,127,142,.1)', color: '#6c7f8e' }}
            >
              <Flame size={20} />
            </div>
            <div>
              <p className="page-eyebrow mb-0">Streak</p>
              <p className="score mb-0" style={{ fontSize: '1.75rem' }}>
                {aluno.streak} dias
              </p>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card-elevated p-4 d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
              style={{ width: 40, height: 40, background: 'rgba(74,222,128,.1)', color: '#4ade80' }}
            >
              <ClipboardCheck size={20} />
            </div>
            <div>
              <p className="page-eyebrow mb-0">Check-ins</p>
              <p className="score mb-0" style={{ fontSize: '1.75rem' }}>
                {presencas.length}
              </p>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card-elevated p-4 d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
              style={{
                width: 40, height: 40,
                background: pendentes > 0 ? 'rgba(251,191,36,.1)' : 'rgba(74,222,128,.1)',
                color: pendentes > 0 ? '#fbbf24' : '#4ade80',
              }}
            >
              <Wallet size={20} />
            </div>
            <div>
              <p className="page-eyebrow mb-0">Mensalidade</p>
              <p
                className="score mb-0"
                style={{
                  fontSize: '1.5rem',
                  color: pendentes > 0 ? '#fbbf24' : '#4ade80',
                }}
              >
                {pendentes > 0 ? 'Pendente' : 'Em dia'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Próximas aulas + Frequência recente */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card-elevated p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Calendar size={16} style={{ color: '#6c7f8e' }} />
              <h2 className="font-display mb-0" style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}>
                PRÓXIMAS AULAS
              </h2>
            </div>
            <div className="d-flex flex-column gap-2">
              {proximas.length === 0 && (
                <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>
                  Nenhuma aula encontrada.
                </p>
              )}
              {proximas.map((a) => {
                const dataAula = new Date(a.data)
                const diaSemana = dataAula.getDay()
                const modalidadeNome = a.modalidade?.nome ?? '—'
                const professorNome = a.professor?.nome?.split(' ')[0] ?? '—'

                return (
                  <div
                    key={a.id}
                    className="d-flex align-items-center justify-content-between p-3 rounded"
                    style={{
                      border: '1px solid #2a2a2a',
                      background: '#1a1a1a',
                      fontSize: '0.875rem',
                    }}
                  >
                    <div>
                      <p className="mb-0 fw-medium">{modalidadeNome}</p>
                      <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                        {DIAS[diaSemana]} · {a.horarioInicio} · {professorNome}
                      </p>
                    </div>
                    <span
                      className="rounded-pill px-2 py-1"
                      style={{
                        background: `${MODALIDADE_COLORS[modalidadeNome] ?? '#6c7f8e'}22`,
                        color: MODALIDADE_COLORS[modalidadeNome] ?? '#6c7f8e',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                      }}
                    >
                      {modalidadeNome}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card-elevated p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <ClipboardCheck size={16} style={{ color: '#4ade80' }} />
              <h2 className="font-display mb-0" style={{ fontSize: '0.875rem', letterSpacing: '0.12em' }}>
                FREQUÊNCIA RECENTE
              </h2>
            </div>
            <div className="d-flex flex-column gap-2">
              {ultimas.length === 0 && (
                <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>
                  Sem check-ins ainda.
                </p>
              )}
              {ultimas.map((f) => {
                const dataPresenca = new Date(f.data)
                const dataFormatada = dataPresenca.toLocaleDateString('pt-BR')

                return (
                  <div
                    key={f.id}
                    className="d-flex align-items-center justify-content-between p-3 rounded"
                    style={{ border: '1px solid #2a2a2a', background: '#1a1a1a' }}
                  >
                    <div>
                      <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>
                        {dataFormatada}
                      </p>
                      <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                        {f.hora}
                      </p>
                    </div>
                    <span
                      className="rounded-pill px-2 py-1"
                      style={{
                        background: 'rgba(74,222,128,.1)',
                        color: '#4ade80',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                      }}
                    >
                      Presente
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
