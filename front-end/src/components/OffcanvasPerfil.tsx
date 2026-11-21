import { useState } from 'react'
import { X, CheckCircle2, Wallet, Calendar, TrendingUp } from 'lucide-react'
import type { Aluno, Pagamento, Frequencia } from '../types'
import {
  corFaixa,
  pagamentosMock,
  frequenciasMock,
  campeonatosMock,
  medicoesMock,
} from '../data/mockData'
import BadgeModalidade from './BadgeModalidade'
import FaixaBadge from './FaixaBadge'
import StatusBadge from './StatusBadge'
import GraficoEvolucao from './GraficoEvolucao'
import HeatmapPresenca from './HeatmapPresenca'

interface Props {
  aluno: Aluno | null
  show: boolean
  onHide: () => void
}

export default function OffcanvasPerfil({ aluno, show, onHide }: Props) {
  const [tab, setTab] = useState<'dados' | 'freq' | 'fin' | 'evo'>('dados')
  const [novoPeso, setNovoPeso] = useState('')
  const [medições, setMedicoes] = useState(() => ({ ...medicoesMock }))

  if (!aluno) return null

  const initials = aluno.nome.split(' ').slice(0, 2).map((n) => n[0]).join('')
  const ringColor = corFaixa(aluno.faixa)
  const pagamentos: Pagamento[] = pagamentosMock.filter((p) => p.alunoId === aluno.id)
  const frequencias: Frequencia[] = frequenciasMock.filter((f) => f.alunoId === aluno.id)
  const campeonatos = campeonatosMock.filter((c) => c.inscricoes.some((i) => i.alunoId === aluno.id))
  const totalPago = pagamentos.filter((p) => p.status === 'pago').reduce((s, p) => s + p.valor, 0)

  const statusVal = aluno.status === 'Ativo'
    ? 'ativo'
    : aluno.status === 'Inadimplente'
    ? 'inadimplente'
    : 'inativo'

  const handleRegistrarMedicao = () => {
    const v = parseFloat(novoPeso)
    if (!v || v < 20 || v > 300) return
    setMedicoes((prev) => ({
      ...prev,
      [aluno.id]: [
        ...(prev[aluno.id] ?? []),
        { data: new Date().toISOString().slice(0, 10), peso: v },
      ],
    }))
    setNovoPeso('')
  }

  return (
    <>
      {/* Backdrop */}
      {show && (
        <div
          onClick={onHide}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.7)',
            backdropFilter: 'blur(2px)',
            zIndex: 1044,
          }}
        />
      )}

      {/* Offcanvas panel */}
      <div
        style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0,
          width: 'min(560px, 100vw)',
          background: '#0d0d0d',
          borderLeft: '1px solid #2a2a2a',
          zIndex: 1045,
          display: 'flex',
          flexDirection: 'column',
          transform: show ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{ borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}
        >
          <h2 className="font-display mb-0" style={{ fontSize: '1.375rem', letterSpacing: '0.05em' }}>
            PERFIL DO ALUNO
          </h2>
          <button className="btn p-1 lh-1" onClick={onHide} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 d-flex flex-column gap-4">
          {/* Resumo */}
          <div
            className="d-flex align-items-start gap-3 p-4 rounded"
            style={{ background: 'linear-gradient(160deg,#111 0%,#0a0a0a 100%)', border: '1px solid #2a2a2a' }}
          >
            <div
              className="avatar-initials flex-shrink-0"
              style={{
                width: 72, height: 72, fontSize: '1.375rem',
                outline: `2px solid ${ringColor}`, outlineOffset: 2,
              }}
            >
              {initials}
            </div>
            <div className="flex-fill min-w-0">
              <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                <h3 className="font-display mb-0" style={{ fontSize: '1.375rem' }}>{aluno.nome}</h3>
                <StatusBadge status={statusVal} />
              </div>
              <p className="text-muted-efc mb-2" style={{ fontSize: '0.8125rem' }}>
                {aluno.idade} anos · {aluno.peso}kg · {aluno.altura.toFixed(2)}m
              </p>
              <div className="d-flex flex-wrap gap-1 mb-2">
                {aluno.modalidades.map((m) => <BadgeModalidade key={m} modalidade={m} />)}
              </div>
              <FaixaBadge faixa={aluno.faixa} />
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs">
            {(['dados','freq','fin','evo'] as const).map((t) => (
              <li className="nav-item" key={t}>
                <button
                  className={`nav-link ${tab === t ? 'active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t === 'dados' ? 'Dados' : t === 'freq' ? 'Frequência' : t === 'fin' ? 'Financeiro' : 'Evolução'}
                </button>
              </li>
            ))}
          </ul>

          {/* Tab: Dados */}
          {tab === 'dados' && (
            <div className="d-flex flex-column gap-2">
              {[
                ['E-mail',      aluno.email],
                ['Telefone',    aluno.telefone],
                ['Matrícula',   new Date(aluno.dataMatricula).toLocaleDateString('pt-BR')],
                ['Mensalidade', `R$ ${aluno.mensalidade}`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="d-flex justify-content-between align-items-center py-2"
                  style={{ borderBottom: '1px solid #1a1a1a', fontSize: '0.875rem' }}
                >
                  <span className="text-muted-efc">{k}</span>
                  <span className="fw-medium">{v}</span>
                </div>
              ))}

              {campeonatos.length > 0 && (
                <div className="p-3 rounded mt-1" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                  <p className="page-eyebrow mb-2">Campeonatos</p>
                  {campeonatos.map((c) => (
                    <p key={c.id} className="mb-1" style={{ fontSize: '0.875rem' }}>{c.nome}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Frequência */}
          {tab === 'freq' && (
            <div className="d-flex flex-column gap-3">
              <div className="p-3 rounded" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <p className="page-eyebrow mb-3">
                  <Calendar size={12} className="me-1" />HEATMAP — 90 DIAS
                </p>
                <HeatmapPresenca alunoId={aluno.id} />
                <p className="text-muted-efc mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
                  {frequencias.length} check-ins registrados
                </p>
              </div>
            </div>
          )}

          {/* Tab: Financeiro */}
          {tab === 'fin' && (
            <div className="d-flex flex-column gap-3">
              <div
                className="d-flex align-items-center justify-content-between p-3 rounded"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
              >
                <span className="d-flex align-items-center gap-2" style={{ fontSize: '0.875rem' }}>
                  <Wallet size={16} style={{ color: '#6c7f8e' }} /> Total pago
                </span>
                <span className="font-display" style={{ fontSize: '1.5rem', color: '#4ade80' }}>
                  R$ {totalPago}
                </span>
              </div>

              <button
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                disabled
                title="Integração com backend pendente"
              >
                <CheckCircle2 size={16} />
                Registrar pagamento (R$ {aluno.mensalidade})
              </button>

              <div className="rounded" style={{ border: '1px solid #2a2a2a', background: '#1a1a1a' }}>
                {pagamentos.length === 0 && (
                  <p className="p-3 mb-0 text-muted-efc" style={{ fontSize: '0.875rem' }}>Sem registros</p>
                )}
                {pagamentos.map((p) => (
                  <div
                    key={p.id}
                    className="d-flex align-items-center justify-content-between p-3"
                    style={{ borderBottom: '1px solid #1a1a1a', fontSize: '0.875rem' }}
                  >
                    <div>
                      <p className="mb-0 fw-medium">{p.referenciaMes}</p>
                      <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                        {p.forma} · {p.data || '—'}
                      </p>
                    </div>
                    <span
                      style={{ color: p.status === 'pago' ? '#4ade80' : '#f87171', fontWeight: 500 }}
                    >
                      R$ {p.valor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Evolução */}
          {tab === 'evo' && (
            <div className="d-flex flex-column gap-3">
              <div className="p-3 rounded" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <p className="page-eyebrow mb-3">
                  <TrendingUp size={12} className="me-1" />EVOLUÇÃO DE PESO
                </p>
                <GraficoEvolucao alunoId={aluno.id} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8125rem' }}>
                  Adicionar medição (peso em kg)
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    placeholder="Ex: 78.5"
                    value={novoPeso}
                    onChange={(e) => setNovoPeso(e.target.value)}
                  />
                  <button className="btn btn-primary flex-shrink-0" onClick={handleRegistrarMedicao}>
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
