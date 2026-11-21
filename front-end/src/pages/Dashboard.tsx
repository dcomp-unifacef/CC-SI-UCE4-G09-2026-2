import { useMemo } from 'react'
import {
  Users, UserCheck, AlertTriangle, DollarSign,
  Calendar, Activity, Bell, ChevronRight,
} from 'lucide-react'
import {
  alunosMock, pagamentosMock, frequenciasMock, aulasMock,
} from '../data/mockData'
import StatCard from '../components/StatCard'
import GraficoFrequencia from '../components/GraficoFrequencia'
import TimelineAulas from '../components/TimelineAulas'
import BadgeModalidade from '../components/BadgeModalidade'

export default function Dashboard() {
  const mesAtual = new Date().toISOString().slice(0, 7)

  const ativos       = alunosMock.filter((a) => a.status === 'Ativo').length
  const inadimplentes = alunosMock.filter((a) => a.status === 'Inadimplente')
  const receita      = pagamentosMock
    .filter((p) => p.status === 'pago' && p.referenciaMes === mesAtual)
    .reduce((s, p) => s + p.valor, 0)
  const esperado     = alunosMock.reduce((s, a) => s + a.mensalidade, 0)

  const recentes = useMemo(
    () =>
      [...frequenciasMock]
        .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora))
        .slice(0, 6),
    [],
  )

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Visão geral</p>
          <h1 className="page-title">DASHBOARD</h1>
        </div>
        <p className="text-muted-efc mb-0" style={{ fontSize: '0.75rem' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
        </p>
      </header>

      {/* StatCards */}
      <div className="row g-3">
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={Users}         label="Total de Alunos" value={alunosMock.length} variation={3.2} />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={UserCheck}     label="Alunos Ativos"   value={ativos}            variant="success" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={AlertTriangle} label="Inadimplentes"   value={inadimplentes.length} variant="danger" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={DollarSign}    label="Receita do mês"  value={receita} prefix="R$ " variation={-5.6} />
        </div>
      </div>

      {/* Gráfico + Alertas */}
      <div className="row g-3">
        {/* Gráfico */}
        <div className="col-lg-8">
          <div className="card-elevated p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="font-display mb-0" style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}>
                FREQUÊNCIA SEMANAL
              </h3>
              <span className="page-eyebrow mb-0">últimos 7 dias</span>
            </div>

            <GraficoFrequencia />

            <div className="row g-2 mt-3">
              {[
                { label: 'Receita esperada', value: `R$ ${esperado}`,           color: '#fff' },
                { label: 'Receita recebida', value: `R$ ${receita}`,            color: '#4ade80' },
                { label: 'A receber',        value: `R$ ${esperado - receita}`, color: '#fbbf24' },
                {
                  label: 'Check-ins (semana)',
                  value: String(
                    frequenciasMock.filter((f) => {
                      const d = new Date(f.data)
                      const cut = new Date()
                      cut.setDate(cut.getDate() - 7)
                      return d >= cut
                    }).length,
                  ),
                  color: '#fff',
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="col-6 col-md-3">
                  <div
                    className="p-3 rounded"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  >
                    <p className="page-eyebrow mb-1">{label}</p>
                    <p className="score mb-0" style={{ fontSize: '1.25rem', color }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas inadimplentes */}
        <div className="col-lg-4">
          <div className="card-elevated p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3
                className="font-display mb-0 d-flex align-items-center gap-2"
                style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}
              >
                <AlertTriangle size={16} style={{ color: '#fbbf24' }} />
                ALERTAS
              </h3>
              <span className="page-eyebrow mb-0">{inadimplentes.length} pendentes</span>
            </div>

            {inadimplentes.length === 0 ? (
              <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>
                Sem atrasos no momento.
              </p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {inadimplentes.map((a) => (
                  <div
                    key={a.id}
                    className="d-flex align-items-center justify-content-between gap-2 p-3 rounded"
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  >
                    <div className="min-w-0">
                      <p className="mb-0 fw-medium text-truncate" style={{ fontSize: '0.875rem' }}>
                        {a.nome}
                      </p>
                      <p
                        className="mb-0 pulse-dot"
                        style={{ fontSize: '0.75rem', color: '#f87171' }}
                      >
                        15 dias em atraso · R$ {a.mensalidade}
                      </p>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary flex-shrink-0 d-flex align-items-center gap-1"
                      disabled
                      title="Integração com backend pendente"
                    >
                      <Bell size={12} /> Notificar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline + Atividade Recente */}
      <div className="row g-3">
        {/* Próximas aulas */}
        <div className="col-lg-6">
          <div className="card-elevated p-4 h-100">
            <h3
              className="font-display mb-3 d-flex align-items-center gap-2"
              style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}
            >
              <Calendar size={16} style={{ color: '#6c7f8e' }} />
              PRÓXIMAS AULAS
            </h3>
            <TimelineAulas />
          </div>
        </div>

        {/* Atividade recente */}
        <div className="col-lg-6">
          <div className="card-elevated p-4 h-100">
            <h3
              className="font-display mb-3 d-flex align-items-center gap-2"
              style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}
            >
              <Activity size={16} style={{ color: '#6c7f8e' }} />
              ATIVIDADE RECENTE
            </h3>
            <div className="d-flex flex-column">
              {recentes.map((f, i) => {
                const aluno = alunosMock.find((a) => a.id === f.alunoId)
                const initials = aluno?.nome.split(' ').slice(0, 2).map((n) => n[0]).join('') ?? ''
                return (
                  <div
                    key={f.id}
                    className="d-flex align-items-center gap-3 py-3"
                    style={{
                      borderBottom: i < recentes.length - 1 ? '1px solid #1a1a1a' : 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    <div className="avatar-initials flex-shrink-0" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                      {initials}
                    </div>
                    <div className="flex-fill min-w-0">
                      <p className="mb-0 fw-medium text-truncate">{aluno?.nome ?? '—'}</p>
                      <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                        Check-in ·{' '}
                        <BadgeModalidade modalidade={f.modalidade} />
                      </p>
                    </div>
                    <span className="text-muted-efc flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                      {new Date(f.data).toLocaleDateString('pt-BR')} {f.hora}
                    </span>
                    <ChevronRight size={16} style={{ color: '#606060' }} />
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
