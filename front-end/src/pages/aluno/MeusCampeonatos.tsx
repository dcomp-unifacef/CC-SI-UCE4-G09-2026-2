import { useEffect, useState } from 'react'
import { Trophy, Calendar, MapPin, Loader2 } from 'lucide-react'
import { alunoMeApi } from '../../services/api'
import type { InscricaoCampeonatoAPI } from '../../services/api'

const MODALIDADE_COLORS: Record<string, string> = {
  Boxe: '#f87171',
  'Muay Thai': '#fbbf24',
  'Jiu-Jitsu': '#60a5fa',
  Funcional: '#4ade80',
}

export default function MeusCampeonatos() {
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [inscricoes, setInscricoes] = useState<InscricaoCampeonatoAPI[]>([])

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErro(null)
      try {
        const dados = await alunoMeApi.obterCampeonatos()
        setInscricoes(dados)
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao carregar campeonatos')
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
      <div className="d-flex flex-column gap-4">
        <div><p className="page-eyebrow">Competições</p><h1 className="page-title">MEUS CAMPEONATOS</h1></div>
        <div className="card-elevated p-4" style={{ border: '1px solid rgba(248,113,113,.3)' }}>
          <p style={{ color: '#f87171', marginBottom: 0 }}>{erro}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Competições</p>
        <h1 className="page-title">MEUS CAMPEONATOS</h1>
      </header>

      {inscricoes.length === 0 && (
        <div
          className="card-elevated p-5 text-center text-muted-efc"
          style={{ fontSize: '0.875rem' }}
        >
          Você ainda não está inscrito em nenhum campeonato.
        </div>
      )}

      <div className="row g-3">
        {inscricoes.map((inscricao) => {
          const c = inscricao.campeonato
          // Status fixo como "inscrito" (schema não tem campo status)
          const statusColor = '#8a9dac'
          const statusBg = 'rgba(108,127,142,.1)'
          const statusBorder = 'rgba(108,127,142,.3)'

          return (
            <div key={inscricao.id} className="col-md-6">
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
                      background: statusBg, 
                      color: statusColor,
                      border: `1px solid ${statusBorder}`,
                      fontSize: '0.6875rem', 
                      fontWeight: 600,
                      textTransform: 'uppercase', 
                      letterSpacing: '0.05em',
                    }}
                  >
                    INSCRITO
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

                {/* Modalidades - campo não existe no schema atual, usando pesosDeLuta como proxy */}
                {c.pesosDeLuta && c.pesosDeLuta.length > 0 && (
                  <div className="d-flex flex-wrap gap-1">
                    {c.pesosDeLuta.slice(0, 3).map((peso, idx) => (
                      <span
                        key={idx}
                        className="rounded-pill px-2 py-1"
                        style={{
                          background: 'rgba(108,127,142,.1)',
                          color: '#8a9dac',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                        }}
                      >
                        {peso}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mb-0 text-muted-efc" style={{ fontSize: '0.8125rem' }}>
                  Peso de luta:{' '}
                  <span className="fw-medium" style={{ color: '#fff' }}>
                    {inscricao.pesoDeLuta}
                  </span>
                </p>

                {c.valores > 0 && (
                  <p className="mb-0 text-muted-efc" style={{ fontSize: '0.8125rem' }}>
                    Taxa:{' '}
                    <span className="fw-medium" style={{ color: '#fff' }}>
                      R$ {c.valores.toFixed(2)}
                    </span>
                  </p>
                )}

                {c.descricao && (
                  <p className="mb-0 text-muted-efc" style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
                    {c.descricao}
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
