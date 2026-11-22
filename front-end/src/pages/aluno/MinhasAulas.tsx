import { useEffect, useState, useMemo } from 'react'
import { Calendar, Loader2 } from 'lucide-react'
import { alunoMeApi } from '../../services/api'
import type { AlunoMeAPI, AulaAPI } from '../../services/api'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const MODALIDADE_COLORS: Record<string, string> = {
  Boxe: '#f87171',
  'Muay Thai': '#fbbf24',
  'Jiu-Jitsu': '#60a5fa',
  Funcional: '#4ade80',
}

export default function MinhasAulas() {
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [aluno, setAluno] = useState<AlunoMeAPI | null>(null)
  const [aulas, setAulas] = useState<AulaAPI[]>([])

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      setErro(null)
      try {
        const [perfilAluno, aulasData] = await Promise.all([
          alunoMeApi.obterPerfil(),
          alunoMeApi.obterAulas(),
        ])
        setAluno(perfilAluno)
        setAulas(aulasData)
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao carregar aulas')
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  const semana = useMemo(() => {
    const map: Record<number, AulaAPI[]> = {}
    DIAS.forEach((_, i) => { map[i] = [] })
    
    aulas.forEach((a) => {
      const data = new Date(a.data)
      const diaSemana = data.getDay()
      map[diaSemana].push(a)
    })
    
    // Ordenar por horário dentro de cada dia
    Object.values(map).forEach((arr) => 
      arr.sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio))
    )
    
    return map
  }, [aulas])

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

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Agenda</p>
        <h1 className="page-title">MINHAS AULAS</h1>
        <p className="text-muted-efc mb-0" style={{ fontSize: '0.8125rem' }}>
          Modalidades: {aluno?.modalidades.join(' · ') || '—'}
        </p>
      </header>

      <div className="row g-3">
        {DIAS.map((dia, i) => (
          <div key={dia} className="col-sm-6 col-lg-4">
            <div className="card-elevated p-4 h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Calendar size={14} style={{ color: '#6c7f8e' }} />
                <h2
                  className="font-display mb-0"
                  style={{ fontSize: '0.8125rem', letterSpacing: '0.12em' }}
                >
                  {dia.toUpperCase()}
                </h2>
              </div>

              {semana[i].length === 0 ? (
                <p className="text-muted-efc mb-0" style={{ fontSize: '0.8125rem' }}>
                  Sem aulas.
                </p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {semana[i].map((a) => {
                    const modalidadeNome = a.modalidade?.nome ?? '—'
                    const professorNome = a.professor?.nome ?? '—'
                    // Nota: o schema atual não tem status de cancelamento em Aula
                    // Mantendo a lógica visual caso seja adicionado no futuro
                    const cancelada = false

                    return (
                      <div
                        key={a.id}
                        className="p-3 rounded"
                        style={{
                          border: `1px solid ${cancelada ? 'rgba(248,113,113,.3)' : '#2a2a2a'}`,
                          background: cancelada ? 'rgba(248,113,113,.05)' : '#1a1a1a',
                          opacity: cancelada ? 0.6 : 1,
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="fw-medium" style={{ fontSize: '0.875rem' }}>
                            {a.horarioInicio}
                          </span>
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
                        <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>
                          {modalidadeNome}
                        </p>
                        <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                          {professorNome}
                        </p>
                        {cancelada && (
                          <p
                            className="mb-0 mt-1"
                            style={{
                              fontSize: '0.625rem',
                              color: '#f87171',
                              textTransform: 'uppercase',
                              letterSpacing: '0.08em',
                            }}
                          >
                            Cancelada
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
