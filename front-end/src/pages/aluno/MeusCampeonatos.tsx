import { useMemo } from 'react'
import { Trophy, Calendar, MapPin } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { campeonatosMock } from '../../data/mockData'
import type { StatusInscricao } from '../../types'
import BadgeModalidade from '../../components/BadgeModalidade'

const statusColors: Record<StatusInscricao, { color: string; border: string; bg: string }> = {
  inscrito:   { color: '#8a9dac', border: 'rgba(108,127,142,.3)', bg: 'rgba(108,127,142,.1)' },
  confirmado: { color: '#4ade80', border: 'rgba(74,222,128,.3)',  bg: 'rgba(74,222,128,.1)'  },
  desistiu:   { color: '#f87171', border: 'rgba(248,113,113,.3)', bg: 'rgba(248,113,113,.1)' },
}

export default function MeusCampeonatos() {
  const { user } = useAuth()
  const id = user?.alunoId ?? 'a2'

  const meus = useMemo(
    () => campeonatosMock.filter((c) => c.inscricoes.some((i) => i.alunoId === id)),
    [id],
  )

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Competições</p>
        <h1 className="page-title">MEUS CAMPEONATOS</h1>
      </header>

      {meus.length === 0 && (
        <div
          className="card-elevated p-5 text-center text-muted-efc"
          style={{ fontSize: '0.875rem' }}
        >
          Você ainda não está inscrito em nenhum campeonato.
        </div>
      )}

      <div className="row g-3">
        {meus.map((c) => {
          const ins = c.inscricoes.find((i) => i.alunoId === id)!
          const sc  = statusColors[ins.status]
          const cat = c.categorias.find((x) => x.id === ins.categoriaId)

          return (
            <div key={c.id} className="col-md-6">
              <div className="card-elevated p-4 h-100 d-flex flex-column gap-3">
                <div className="d-flex align-items-start justify-content-between gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <Trophy size={18} style={{ color: '#6c7f8e', flexShrink: 0 }} />
                    <h3
                      className="font-display mb-0"
                      style={{ fontSize: '0.9375rem', letterSpacing: '0.04em', lineHeight: 1.2 }}
                    >
                      {c.nome.toUpperCase()}
                    </h3>
                  </div>
                  <span
                    className="rounded-pill px-2 py-1 flex-shrink-0"
                    style={{
                      background: sc.bg, color: sc.color,
                      border: `1px solid ${sc.border}`,
                      fontSize: '0.6875rem', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}
                  >
                    {ins.status}
                  </span>
                </div>

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

                {cat && (
                  <p className="mb-0 text-muted-efc" style={{ fontSize: '0.8125rem' }}>
                    Categoria:{' '}
                    <span className="fw-medium" style={{ color: '#fff' }}>
                      {cat.nome}{cat.pesoMax ? ` (até ${cat.pesoMax}kg)` : ''}
                    </span>
                  </p>
                )}

                {c.taxaInscricao > 0 && (
                  <p className="mb-0 text-muted-efc" style={{ fontSize: '0.8125rem' }}>
                    Taxa:{' '}
                    <span className="fw-medium" style={{ color: '#fff' }}>R$ {c.taxaInscricao}</span>
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
