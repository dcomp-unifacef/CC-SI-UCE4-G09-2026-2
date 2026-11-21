import { useState } from 'react'
import { Calendar, MapPin, Users, Trophy, X, Car } from 'lucide-react'
import { campeonatosMock, alunosMock } from '../data/mockData'
import type { Campeonato, StatusCampeonato } from '../types'
import BadgeModalidade from '../components/BadgeModalidade'

const statusStyle: Record<StatusCampeonato, { bg: string; color: string; border: string }> = {
  'Confirmado':         { bg: 'rgba(45,106,79,.15)',  color: '#4ade80', border: 'rgba(45,106,79,.3)' },
  'Em organização':     { bg: 'rgba(146,102,26,.15)', color: '#fbbf24', border: 'rgba(146,102,26,.3)' },
  'Inscrições abertas': { bg: 'rgba(108,127,142,.15)',color: '#8a9dac', border: 'rgba(108,127,142,.3)' },
  'Encerrado':          { bg: 'rgba(42,42,42,.5)',    color: '#a0a0a0', border: '#2a2a2a' },
}

export default function Campeonatos() {
  const [campeonatos] = useState<Campeonato[]>(campeonatosMock)
  const [detalhe, setDetalhe]   = useState<Campeonato | null>(null)

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Competições</p>
        <h1 className="page-title">CAMPEONATOS</h1>
      </header>

      <div className="row g-4">
        {campeonatos.map((c) => {
          const total = c.inscricoes.length
          const max   = Math.max(10, c.categorias.length * 4)
          const pct   = Math.min(100, Math.round((total / max) * 100))
          const ss    = statusStyle[c.status]

          return (
            <div key={c.id} className="col-md-6 col-xl-4">
              <div className="card-elevated h-100 overflow-hidden" style={{ padding: 0 }}>
                {/* Capa */}
                <div
                  className="position-relative champ-cover"
                  style={{ height: 120 }}
                >
                  {/* Padrão hexagonal SVG */}
                  <svg
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern id={`hex-${c.id}`} width="40" height="46" patternUnits="userSpaceOnUse">
                        <path d="M20 0L40 12v22L20 46 0 34V12z" fill="none" stroke="white" strokeOpacity="0.4" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#hex-${c.id})`} />
                  </svg>

                  {/* Gradiente sobre a capa */}
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, #111111, transparent)',
                    }}
                  />

                  {/* Badge status */}
                  <span
                    className="position-absolute"
                    style={{
                      top: 12, right: 12,
                      background: ss.bg, color: ss.color,
                      border: `1px solid ${ss.border}`,
                      borderRadius: '50rem',
                      padding: '0.15rem 0.6rem',
                      fontSize: '0.6875rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {c.status}
                  </span>

                  <Trophy
                    size={28}
                    style={{ position: 'absolute', bottom: 10, left: 16, color: 'rgba(108,127,142,.7)' }}
                  />
                </div>

                {/* Corpo */}
                <div className="p-4 d-flex flex-column gap-3">
                  <h3
                    className="font-display mb-0"
                    style={{ fontSize: '1.0625rem', letterSpacing: '0.04em', lineHeight: 1.2 }}
                  >
                    {c.nome.toUpperCase()}
                  </h3>

                  <div className="d-flex flex-column gap-1 text-muted-efc" style={{ fontSize: '0.8125rem' }}>
                    <p className="mb-0 d-flex align-items-center gap-2">
                      <Calendar size={13} />
                      {new Date(c.data).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="mb-0 d-flex align-items-center gap-2">
                      <MapPin size={13} />
                      {c.local}
                    </p>
                  </div>

                  <div className="d-flex flex-wrap gap-1">
                    {c.modalidades.map((m) => <BadgeModalidade key={m} modalidade={m} />)}
                  </div>

                  {/* Barra progresso inscrições */}
                  <div>
                    <div
                      className="d-flex justify-content-between mb-1"
                      style={{ fontSize: '0.6875rem', color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                    >
                      <span className="d-flex align-items-center gap-1">
                        <Users size={11} /> Inscrições
                      </span>
                      <span>{total} / {max}</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => setDetalhe(c)}
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal detalhes */}
      {detalhe && (
        <>
          <div
            onClick={() => setDetalhe(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1054 }}
          />
          <div
            style={{
              position: 'fixed', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 'min(640px, 95vw)',
              maxHeight: '85vh',
              overflowY: 'auto',
              zIndex: 1055,
            }}
          >
            <div className="modal-content p-0">
              <div className="modal-header px-4 py-3 d-flex align-items-center justify-content-between">
                <h5 className="font-display mb-0" style={{ letterSpacing: '0.05em' }}>
                  <Trophy size={16} className="me-2" style={{ color: '#6c7f8e' }} />
                  {detalhe.nome.toUpperCase()}
                </h5>
                <button className="btn p-1 lh-1" onClick={() => setDetalhe(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body px-4 py-4 d-flex flex-column gap-4">
                {/* Infos */}
                <div className="row g-3">
                  {[
                    { label: 'Data',          value: new Date(detalhe.data).toLocaleDateString('pt-BR') },
                    { label: 'Local',         value: detalhe.local },
                    { label: 'Locomoção',     value: detalhe.locomocao },
                    { label: 'Taxa',          value: detalhe.taxaInscricao > 0 ? `R$ ${detalhe.taxaInscricao}` : 'Gratuito' },
                  ].map(({ label, value }) => (
                    <div key={label} className="col-sm-6">
                      <p className="page-eyebrow mb-1">{label}</p>
                      <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>{value}</p>
                    </div>
                  ))}
                </div>

                {detalhe.descricao && (
                  <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>{detalhe.descricao}</p>
                )}

                {/* Categorias */}
                <div>
                  <p className="page-eyebrow mb-2">Categorias ({detalhe.categorias.length})</p>
                  <div className="d-flex flex-wrap gap-2">
                    {detalhe.categorias.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-2 py-1 rounded"
                        style={{
                          background: '#1a1a1a', border: '1px solid #2a2a2a',
                          fontSize: '0.75rem', color: '#a0a0a0',
                        }}
                      >
                        {cat.nome}{cat.pesoMax ? ` (até ${cat.pesoMax}kg)` : ''}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inscritos */}
                <div>
                  <p className="page-eyebrow mb-2">Inscritos ({detalhe.inscricoes.length})</p>
                  <div className="d-flex flex-column gap-1">
                    {detalhe.inscricoes.map((ins) => {
                      const aluno = alunosMock.find((a) => a.id === ins.alunoId)
                      const cat   = detalhe.categorias.find((c) => c.id === ins.categoriaId)
                      const sc    =
                        ins.status === 'confirmado' ? '#4ade80'
                        : ins.status === 'desistiu'  ? '#f87171'
                        : '#8a9dac'
                      return (
                        <div
                          key={ins.alunoId}
                          className="d-flex align-items-center justify-content-between p-3 rounded"
                          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', fontSize: '0.875rem' }}
                        >
                          <div>
                            <p className="mb-0 fw-medium">{aluno?.nome ?? '—'}</p>
                            {cat && <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>{cat.nome}</p>}
                          </div>
                          <span
                            style={{
                              color: sc,
                              fontSize: '0.6875rem',
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {ins.status}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
