import { Users } from 'lucide-react'
import { alunosMock, aulasMock } from '../data/mockData'
import type { Modalidade } from '../types'
import BadgeModalidade from '../components/BadgeModalidade'

const MODS: Modalidade[] = ['Boxe', 'Muay Thai', 'Jiu-Jitsu', 'Funcional']

const descricoes: Record<Modalidade, string> = {
  'Boxe':      'Técnicas de socos, defesa e footwork. Ideal para todos os níveis.',
  'Muay Thai': 'Arte marcial tailandesa com socos, chutes, joelhadas e cotoveladas.',
  'Jiu-Jitsu': 'Luta agarrada com foco em projeções, quedas e finalizações no chão.',
  'Funcional': 'Treinamento físico com movimentos funcionais, força e condicionamento.',
}

export default function Modalidades() {
  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Catálogo</p>
        <h1 className="page-title">MODALIDADES</h1>
      </header>

      <div className="row g-4">
        {MODS.map((m) => {
          const totalAlunos = alunosMock.filter((a) => a.modalidades.includes(m)).length
          const totalAulas  = aulasMock.filter((a) => a.modalidade === m).length

          return (
            <div key={m} className="col-sm-6 col-xl-3">
              <div className="card-elevated p-5 animate-fade-in-up h-100 d-flex flex-column gap-3">
                <BadgeModalidade modalidade={m} size="md" />

                <p className="text-muted-efc mb-0" style={{ fontSize: '0.8125rem' }}>
                  {descricoes[m]}
                </p>

                <div className="row g-2 mt-auto">
                  <div className="col-6">
                    <div
                      className="p-3 rounded text-center"
                      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    >
                      <p className="page-eyebrow mb-1">Alunos</p>
                      <p className="score mb-0" style={{ fontSize: '2.5rem' }}>
                        {totalAlunos}
                      </p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div
                      className="p-3 rounded text-center"
                      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    >
                      <p className="page-eyebrow mb-1">Aulas/sem</p>
                      <p className="score mb-0" style={{ fontSize: '2.5rem' }}>
                        {totalAulas}
                      </p>
                    </div>
                  </div>
                </div>

                <p
                  className="d-flex align-items-center gap-1 mb-0 text-muted-efc"
                  style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  <Users size={12} /> Ativos no mês
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
