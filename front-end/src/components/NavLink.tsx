import { NavLink as RouterNavLink } from 'react-router'
import type { LucideIcon } from 'lucide-react'

interface SidebarLinkProps {
  to: string
  label: string
  icon: LucideIcon
  badge?: number
  onClick?: () => void
}

/**
 * Item de navegação da sidebar — adaptação do NavLink do protótipo
 * para Bootstrap. Encapsula o estilo ativo (barra + ícone + fundo).
 */
export default function SidebarLink({ to, label, icon: Icon, badge = 0, onClick }: SidebarLinkProps) {
  return (
    <RouterNavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
    >
      <span className="sidebar-link-bar" />
      <Icon size={18} className="sidebar-icon" />
      <span>{label}</span>
      {badge > 0 && <span className="badge text-bg-danger ms-auto">{badge}</span>}
    </RouterNavLink>
  )
}
