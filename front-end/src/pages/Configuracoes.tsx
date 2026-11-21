import { Settings } from 'lucide-react'

export default function Configuracoes() {
  return (
    <div className="d-flex flex-column gap-4">
      <header className="animate-fade-in">
        <p className="page-eyebrow">Sistema</p>
        <h1 className="page-title">CONFIGURAÇÕES</h1>
      </header>

      <div className="card-elevated p-5 text-center">
        <Settings size={48} className="text-muted-efc mb-3" />
        <h2 className="font-display mb-2" style={{ fontSize: '1.25rem', letterSpacing: '0.08em' }}>
          EM CONSTRUÇÃO
        </h2>
        <p className="text-muted-efc mb-0" style={{ fontSize: '0.875rem' }}>
          Configurações de perfil, academia e sistema serão integradas ao backend.
        </p>
      </div>
    </div>
  )
}
