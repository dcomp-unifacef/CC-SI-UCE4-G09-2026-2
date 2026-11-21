import { useMemo, useEffect, useState } from 'react'
import { Users, UserCheck, AlertTriangle, DollarSign, Calendar, Activity, ChevronRight } from 'lucide-react'
import { alunosApi, presencasApi, aulasApi } from '../services/api'
import type { AlunoAPI, PresencaAPI, AulaAPI } from '../services/api'
import { alunoFromAPI } from '../services/mappers'
import StatCard from '../components/StatCard'
import GraficoFrequencia from '../components/GraficoFrequencia'
import TimelineAulas from '../components/TimelineAulas'
import SkeletonLoader from '../components/SkeletonLoader'

export default function Dashboard() {
  const [alunos, setAlunos]       = useState<AlunoAPI[]>([])
  const [presencas, setPresencas] = useState<PresencaAPI[]>([])
  const [aulas, setAulas]         = useState<AulaAPI[]>([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([alunosApi.listar(), presencasApi.listar(), aulasApi.listar()])
      .then(([as, ps, au]) => { setAlunos(as); setPresencas(ps); setAulas(au) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const ativos        = alunos.filter((a) => a.status === 'ATIVO').length
  const inadimplentes = alunos.filter((a) => a.status === 'INADIMPLENTE')
  const esperado      = alunos.reduce((s, a) => s + a.valorMensalidade, 0)

  const cut7 = new Date(); cut7.setDate(cut7.getDate() - 7)
  const checkinsSemana = presencas.filter((p) => new Date(p.data) >= cut7).length

  const recentes = useMemo(
    () => [...presencas]
      .sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora))
      .slice(0, 6),
    [presencas],
  )

  if (loading) return (
    <div className="d-flex flex-column gap-4">
      <div><p className="page-eyebrow">Visão geral</p><h1 className="page-title">DASHBOARD</h1></div>
      <div className="row g-3">
        {[1,2,3,4].map((i) => <div key={i} className="col-sm-6 col-xl-3"><SkeletonLoader rows={3} height="1.5rem" /></div>)}
      </div>
    </div>
  )

  return (
    <div className="d-flex flex-column gap-4">
      <header className="d-flex flex-wrap align-items-end justify-content-between gap-2 animate-fade-in">
        <div>
          <p className="page-eyebrow">Visão geral</p>
          <h1 className="page-title">DASHBOARD</h1>
        </div>
        <p className="text-muted-efc mb-0" style={{ fontSize: '0.75rem' }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
        </p>
      </header>

      <div className="row g-3">
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={Users}         label="Total de Alunos" value={alunos.length} />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={UserCheck}     label="Alunos Ativos"   value={ativos} variant="success" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={AlertTriangle} label="Inadimplentes"   value={inadimplentes.length} variant="danger" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard icon={DollarSign}    label="Mensalidades/mês" value={esperado} prefix="R$ " />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card-elevated p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="font-display mb-0" style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}>
                FREQUÊNCIA SEMANAL
              </h3>
              <span className="page-eyebrow mb-0">últimos 7 dias</span>
            </div>

            <GraficoFrequencia presencas={presencas} />

            <div className="row g-2 mt-3">
              {[
                { label: 'Mensalidades esperadas', value: `R$ ${esperado}`, color: '#fff' },
                { label: 'Check-ins (semana)',      value: String(checkinsSemana), color: '#8a9dac' },
                { label: 'Alunos ativos',           value: String(ativos), color: '#4ade80' },
                { label: 'Inadimplentes',           value: String(inadimplentes.length), color: inadimplentes.length > 0 ? '#f87171' : '#a0a0a0' },
              ].map(({ label, value, color }) => (
                <div key={label} className="col-6 col-md-3">
                  <div className="p-3 rounded" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                    <p className="page-eyebrow mb-1">{label}</p>
                    <p className="score mb-0" style={{ fontSize: '1.25rem', color }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card-elevated p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="font-display mb-0 d-flex align-items-center gap-2"
                style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}>
                <AlertTriangle size={16} style={{ color: '#fbbf24' }} />ALERTAS
              </h3>
              <span className="page-eyebrow mb-0">{inadimplentes.length} pendentes</span>
            </div>

            {inadimplentes.length === 0 ? (
              <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>Sem inadimplentes no momento.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {inadimplentes.map((a) => (
                  <div key={a.id} className="p-3 rounded" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                    <p className="mb-0 fw-medium text-truncate" style={{ fontSize: '0.875rem' }}>{a.nome}</p>
                    <p className="mb-0 pulse-dot" style={{ fontSize: '0.75rem', color: '#f87171' }}>
                      Inadimplente · R$ {a.valorMensalidade}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card-elevated p-4 h-100">
            <h3 className="font-display mb-3 d-flex align-items-center gap-2"
              style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}>
              <Calendar size={16} style={{ color: '#6c7f8e' }} />PRÓXIMAS AULAS
            </h3>
            <TimelineAulas aulas={aulas} />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card-elevated p-4 h-100">
            <h3 className="font-display mb-3 d-flex align-items-center gap-2"
              style={{ fontSize: '1.125rem', letterSpacing: '0.08em' }}>
              <Activity size={16} style={{ color: '#6c7f8e' }} />CHECK-INS RECENTES
            </h3>
            {recentes.length === 0 ? (
              <p className="text-muted-efc" style={{ fontSize: '0.875rem' }}>Nenhum check-in registrado.</p>
            ) : (
              <div className="d-flex flex-column">
                {recentes.map((p, i) => {
                  const aluno = alunos.find((a) => a.id === p.alunoId)
                  const initials = aluno?.nome.split(' ').slice(0, 2).map((n) => n[0]).join('') ?? ''
                  return (
                    <div key={p.id} className="d-flex align-items-center gap-3 py-3"
                      style={{ borderBottom: i < recentes.length - 1 ? '1px solid #1a1a1a' : 'none', fontSize: '0.875rem' }}>
                      <div className="avatar-initials flex-shrink-0" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                        {initials}
                      </div>
                      <div className="flex-fill min-w-0">
                        <p className="mb-0 fw-medium text-truncate">{aluno?.nome ?? `Aluno #${p.alunoId}`}</p>
                        <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>Check-in · {p.hora}</p>
                      </div>
                      <span className="text-muted-efc flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                        {new Date(p.data).toLocaleDateString('pt-BR')}
                      </span>
                      <ChevronRight size={16} style={{ color: '#606060' }} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
