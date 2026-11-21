import { Swords } from 'lucide-react'

export default function Particulares() {
  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Em breve</p>
        <h1 className="page-title">AULAS PARTICULARES</h1>
      </header>

      <div className="card-elevated p-5 text-center">
        <Swords size={48} className="text-muted-efc mb-3" />
        <h2 className="font-display mb-2" style={{ fontSize: '1.25rem', letterSpacing: '0.08em' }}>
          EM CONSTRUÇÃO
        </h2>
        <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>
          Agendamento e gerenciamento de aulas particulares serão disponibilizados em breve.
        </p>
      </div>
    </div>
  )
}
