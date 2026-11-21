import { Users } from 'lucide-react'
import { aulasMock } from '../data/mockData'
import BadgeModalidade from './BadgeModalidade'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

export default function TimelineAulas() {
  const proximas = aulasMock
    .filter((a) => a.status === 'agendada')
    .slice(0, 5)

  return (
    <div className="d-flex flex-column gap-2">
      {proximas.map((a) => (
        <div
          key={a.id}
          className="d-flex align-items-center justify-content-between gap-3 p-3 rounded"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
        >
          <div className="d-flex align-items-center gap-3 min-w-0">
            <div
              className="font-display text-center flex-shrink-0"
              style={{ width: 40, fontSize: '1.125rem', color: '#6c7f8e' }}
            >
              {a.hora}
            </div>
            <div className="min-w-0">
              <p className="mb-0 fw-medium text-truncate" style={{ fontSize: '0.875rem' }}>
                {a.nome}
              </p>
              <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                {DIAS[a.diaSemana]} · {a.professor.split(' ')[0]}
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <BadgeModalidade modalidade={a.modalidade} />
            <span
              className="d-flex align-items-center gap-1 text-muted-efc"
              style={{ fontSize: '0.6875rem' }}
            >
              <Users size={12} />
              {a.inscritos}/{a.capacidade}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
