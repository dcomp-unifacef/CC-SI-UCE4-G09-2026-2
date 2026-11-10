import type { LucideIcon } from 'lucide-react'
import { Construction } from 'lucide-react'

interface EmConstrucaoProps {
  title: string
  icon?: LucideIcon
}

export default function EmConstrucao({ title, icon: Icon = Construction }: EmConstrucaoProps) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
      <Icon size={48} className="text-secondary mb-3" />
      <h1 className="font-display mb-1">{title}</h1>
      <p className="text-secondary mb-0">Módulo em construção.</p>
    </div>
  )
}
