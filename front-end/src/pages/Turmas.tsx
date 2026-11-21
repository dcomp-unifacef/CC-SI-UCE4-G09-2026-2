import { useMemo, useState } from 'react'
import { CalendarOff, Users } from 'lucide-react'
import { aulasMock } from '../data/mockData'
import type { Aula } from '../types'
import BadgeModalidade from '../components/BadgeModalidade'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function Turmas() {
  const [aulas, setAulas] = useState<Aula[]>(aulasMock)

  const semana = useMemo(() => {
    const map: Record<number, Aula[]> = {}
    for (let i = 0; i < 7; i++) map[i] = []
    aulas.forEach((a) => map[a.diaSemana].push(a))
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.hora.localeCompare(b.hora)))
    return map
  }, [aulas])

  const cancelar = (id: string) => {
    setAulas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelada' as const } : a)),
    )
  }

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Cronograma</p>
        <h1 className="page-title">AULAS &amp; TURMAS</h1>
      </header>

      <div className="row g-3">
        {Array.from({ length: 7 }).map((_, dia) => (
          <div key={dia} className="col-sm-6 col-lg-3 col-xl">
            <div className="card-elevated p-3 h-100">
              <h3
                className="font-display text-center mb-3"
                style={{ fontSize: '0.8125rem', letterSpacing: '0.12em', color: '#a0a0a0' }}
              >
                {DIAS[dia].toUpperCase()}
              </h3>

              <div className="d-flex flex-column gap-2">
                {semana[dia].length === 0 ? (
                  <div
                    className="text-center p-3 rounded text-muted-efc"
                    style={{
                      border: '1px dashed #2a2a2a',
                      fontSize: '0.6875rem',
                    }}
                  >
                    Sem aulas
                  </div>
                ) : (
                  semana[dia].map((a) => (
                    <div
                      key={a.id}
                      className="rounded p-2"
                      style={{
                        border: `1px solid ${a.status === 'cancelada' ? 'rgba(248,113,113,.4)' : '#2a2a2a'}`,
                        background: a.status === 'cancelada' ? 'rgba(248,113,113,.05)' : '#1a1a1a',
                        opacity: a.status === 'cancelada' ? 0.6 : 1,
                        fontSize: '0.75rem',
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span
                          className="font-display"
                          style={{ fontSize: '1rem', color: '#6c7f8e' }}
                        >
                          {a.hora}
                        </span>
                        {a.status === 'cancelada' && (
                          <span style={{ fontSize: '0.625rem', color: '#f87171', textTransform: 'uppercase' }}>
                            Cancelada
                          </span>
                        )}
                      </div>

                      <p className="mb-1 fw-medium" style={{ fontSize: '0.8125rem' }}>{a.nome}</p>
                      <p className="mb-1 text-muted-efc">Prof. {a.professor.split(' ')[0]}</p>

                      <div className="d-flex align-items-center justify-content-between mt-1">
                        <BadgeModalidade modalidade={a.modalidade} />
                        <span
                          className="d-flex align-items-center gap-1 text-muted-efc"
                          style={{ fontSize: '0.6875rem' }}
                        >
                          <Users size={10} />
                          {a.inscritos}/{a.capacidade}
                        </span>
                      </div>

                      {a.status !== 'cancelada' && (
                        <button
                          className="btn btn-sm w-100 mt-2 d-flex align-items-center justify-content-center gap-1"
                          style={{
                            height: 28,
                            fontSize: '0.6875rem',
                            color: '#f87171',
                            background: 'transparent',
                            border: '1px solid rgba(248,113,113,.3)',
                          }}
                          onClick={() => cancelar(a.id)}
                        >
                          <CalendarOff size={12} /> Cancelar
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
