import { useMemo } from 'react'
import { Calendar, Flame, Wallet, ClipboardCheck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import {
  alunosMock, aulasMock, pagamentosMock, frequenciasMock,
} from '../../data/mockData'
import BadgeModalidade from '../../components/BadgeModalidade'
import FaixaBadge from '../../components/FaixaBadge'
import StatusBadge from '../../components/StatusBadge'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function AlunoInicio() {
  const { user } = useAuth()
  const id = user?.alunoId ?? 'a2' // fallback para demo

  const aluno = alunosMock.find((a) => a.id === id)

  const proximas = useMemo(
    () =>
      aulasMock
        .filter((a) => a.status === 'agendada' && aluno?.modalidades.includes(a.modalidade))
        .slice(0, 4),
    [aluno],
  )

  const mesAtual = new Date().toISOString().slice(0, 7)
  const meusPag  = pagamentosMock.filter((p) => p.alunoId === id)
  const pendentes = meusPag.filter((p) => p.status !== 'pago').length

  const minhasFreq = useMemo(
    () => frequenciasMock.filter((f) => f.alunoId === id),
    [id],
  )
  const ultimas = minhasFreq.slice(0, 5)

  if (!aluno) return null

  const initials = aluno.nome.split(' ').slice(0, 2).map((n) => n[0]).join('')
  const statusVal = aluno.status === 'Ativo' ? 'ativo'
    : aluno.status === 'Inadimplente' ? 'inadimplente'
    : 'inativo'

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
              <FaixaBadge faixa={aluno.faixa} showBar={false} />
              {aluno.modalidades.map((m) => <BadgeModalidade key={m} modalidade={m} />)}
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
                {minhasFreq.length}
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
              {proximas.map((a) => (
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
                    <p className="mb-0 fw-medium">{a.nome}</p>
                    <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                      {DIAS[a.diaSemana]} · {a.hora} · {a.professor.split(' ')[0]}
                    </p>
                  </div>
                  <BadgeModalidade modalidade={a.modalidade} />
                </div>
              ))}
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
              {ultimas.map((f) => (
                <div
                  key={f.id}
                  className="d-flex align-items-center justify-content-between p-3 rounded"
                  style={{ border: '1px solid #2a2a2a', background: '#1a1a1a' }}
                >
                  <div>
                    <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>
                      {new Date(f.data).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                      {f.hora} · {f.modalidade}
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
