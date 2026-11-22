import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink as RouterNavLink, useNavigate } from 'react-router'
import {
  LayoutDashboard, Users, Users2, Calendar, Trophy,
  ClipboardCheck, Wallet, Bell, LogOut, Menu, X, Swords,
} from 'lucide-react'
import Logo from './Logo'
import SidebarLink from './NavLink'
import { useAuth } from '../contexts/AuthContext'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/alunos', label: 'Alunos', icon: Users },
  { to: '/turmas', label: 'Aulas & Turmas', icon: Calendar },
  { to: '/campeonatos', label: 'Campeonatos', icon: Trophy },
  { to: '/frequencia', label: 'Frequência', icon: ClipboardCheck },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
  { to: '/professores', label: 'Professores',  icon: Users2 },
  { to: '/modalidades', label: 'Modalidades', icon: Swords },
  { to: '/notificacoes', label: 'Notificações', icon: Bell },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { logout, user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const role = isAdmin ? 'Administrador' : 'Aluno'

  return (
    <div className="app-shell">
      <aside className={`app-sidebar${open ? ' open' : ''}`}>
        <div className="app-sidebar-header">
          <Logo showWordmark size={32} />
          <button
            className="btn p-0 lh-1 d-md-none"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="app-sidebar-nav">
          {nav.map((item) => (
            <SidebarLink key={item.to} {...item} onClick={() => setOpen(false)} />
          ))}
        </nav>

        <div className="app-sidebar-footer">
          <div className="px-1 mb-2" style={{ fontSize: '0.75rem' }}>
            <div className="text-truncate">{user?.nome ?? 'Convidado'}</div>
            <div className="text-primary">{role}</div>
          </div>
          <button
            className="btn btn-sm btn-link text-decoration-none text-secondary w-100 d-flex align-items-center justify-content-start gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {open && <div className="sidebar-overlay d-md-none" onClick={() => setOpen(false)} />}

      <div className="app-content">
        <header className="app-header">
          <button
            className="btn p-0 lh-1 d-md-none"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <div className="d-md-none">
            <Logo size={28} />
          </div>
          <div className="ms-auto d-flex align-items-center gap-2">
            <RouterNavLink to="/notificacoes" className="header-icon-btn d-inline-flex align-items-center p-2 position-relative">
              <Bell size={20} />
            </RouterNavLink>
          </div>
        </header>

        <main className="app-main">{children}</main>
      </div>
    </div>
  )
}
