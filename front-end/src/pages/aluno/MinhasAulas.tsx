import { useMemo } from 'react'
import { Calendar } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { alunosMock, aulasMock } from '../../data/mockData'
import BadgeModalidade from '../../components/BadgeModalidade'

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function MinhasAulas() {
  const { user } = useAuth()
  const id    = user?.alunoId ?? 'a2'
  const aluno = alunosMock.find((a) => a.id === id)

  const minhas = useMemo(
    () => aulasMock.filter((a) => aluno?.modalidades.includes(a.modalidade)),
    [aluno],
  )

  const semana = useMemo(() => {
    const map: Record<number, typeof minhas> = {}
    DIAS.forEach((_, i) => { map[i] = [] })
    minhas.forEach((a) => map[a.diaSemana].push(a))
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.hora.localeCompare(b.hora)))
    return map
  }, [minhas])

  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Agenda</p>
        <h1 className="page-title">MINHAS AULAS</h1>
        <p className="text-muted-efc mb-0" style={{ fontSize: '0.8125rem' }}>
          Modalidades: {aluno?.modalidades.join(' · ')}
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
                  {semana[i].map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded"
                      style={{
                        border: `1px solid ${a.status === 'cancelada' ? 'rgba(248,113,113,.3)' : '#2a2a2a'}`,
                        background: a.status === 'cancelada' ? 'rgba(248,113,113,.05)' : '#1a1a1a',
                        opacity: a.status === 'cancelada' ? 0.6 : 1,
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-medium" style={{ fontSize: '0.875rem' }}>{a.hora}</span>
                        <BadgeModalidade modalidade={a.modalidade} />
                      </div>
                      <p className="mb-0 fw-medium" style={{ fontSize: '0.875rem' }}>{a.nome}</p>
                      <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                        {a.professor}
                      </p>
                      {a.status === 'cancelada' && (
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
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
