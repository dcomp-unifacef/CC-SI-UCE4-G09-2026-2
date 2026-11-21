import { useMemo } from 'react'
import { Users } from 'lucide-react'
import type { AulaAPI } from '../services/api'
import type { Modalidade } from '../types'
import BadgeModalidade from './BadgeModalidade'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function toModalidade(nome?: string): Modalidade | null {
  const n = (nome ?? '').toLowerCase()
  if (n.includes('boxe')) return 'Boxe'
  if (n.includes('muay')) return 'Muay Thai'
  if (n.includes('jiu')) return 'Jiu-Jitsu'
  if (n.includes('funcional')) return 'Funcional'
  return null
}

// Data da aula (AAAA-MM-DD) + horário (HH:mm) como chave comparável
const chave = (a: AulaAPI) => `${a.data.slice(0, 10)} ${a.horarioInicio}`

interface Props {
  aulas: AulaAPI[]
  limite?: number
}

export default function TimelineAulas({ aulas, limite = 5 }: Props) {
  const proximas = useMemo(() => {
    const agora = new Date()
    const hoje = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`
    const hora = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`
    const agoraChave = `${hoje} ${hora}`
    return aulas
      .filter((a) => chave(a) >= agoraChave)
      .sort((a, b) => chave(a).localeCompare(chave(b)))
      .slice(0, limite)
  }, [aulas, limite])

  if (proximas.length === 0) {
    return (
      <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>
        Nenhuma aula agendada. Cadastre aulas em "Aulas &amp; Turmas".
      </p>
    )
  }

  return (
    <div className="d-flex flex-column gap-2">
      {proximas.map((a) => {
        const mod = toModalidade(a.modalidade?.nome)
        const dia = new Date(`${a.data.slice(0, 10)}T12:00:00`)
        return (
          <div
            key={a.id}
            className="d-flex align-items-center justify-content-between gap-3 p-3 rounded"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
          >
            <div className="d-flex align-items-center gap-3 min-w-0">
              <div className="font-display text-center flex-shrink-0" style={{ width: 48, fontSize: '1.125rem', color: '#6c7f8e' }}>
                {a.horarioInicio}
              </div>
              <div className="min-w-0">
                <p className="mb-0 fw-medium text-truncate" style={{ fontSize: '0.875rem' }}>
                  {a.turma?.nome ?? 'Aula'}
                </p>
                <p className="mb-0 text-muted-efc" style={{ fontSize: '0.75rem' }}>
                  {DIAS[dia.getDay()]} {dia.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  {a.professor ? ` · ${a.professor.nome.split(' ')[0]}` : ''}
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              {mod ? (
                <BadgeModalidade modalidade={mod} />
              ) : (
                a.modalidade && <span className="text-muted-efc" style={{ fontSize: '0.6875rem' }}>{a.modalidade.nome}</span>
              )}
              <span className="d-flex align-items-center gap-1 text-muted-efc" style={{ fontSize: '0.6875rem' }}>
                <Users size={12} /> {a.capacidade} vagas
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
