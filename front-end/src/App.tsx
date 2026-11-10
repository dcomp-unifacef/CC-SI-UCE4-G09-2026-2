import { BrowserRouter, Routes, Route } from 'react-router'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, Users, Calendar, Trophy, ClipboardCheck,
  Wallet, Swords, Bell, Home, CalendarDays, TrendingUp, BarChart3, Settings,
} from 'lucide-react'

import { AuthProvider, useAuth } from './contexts/AuthContext'
import AppLayout from './components/AppLayout'
import AlunoLayout from './components/AlunoLayout'
import EmConstrucao from './pages/EmConstrucao'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

/** Admin: sempre usa AppLayout */
function Admin({ title, icon }: { title: string; icon?: LucideIcon }) {
  return (
    <AppLayout>
      <EmConstrucao title={title} icon={icon} />
    </AppLayout>
  )
}

/** Aluno: sempre usa AlunoLayout */
function Aluno({ title, icon }: { title: string; icon?: LucideIcon }) {
  return (
    <AlunoLayout>
      <EmConstrucao title={title} icon={icon} />
    </AlunoLayout>
  )
}

/** Home e Notificações: layout conforme o papel (sem ProtectedRoute) */
function RoleRoute({ adminTitle, alunoTitle, adminIcon, alunoIcon }: {
  adminTitle: string
  alunoTitle: string
  adminIcon?: LucideIcon
  alunoIcon?: LucideIcon
}) {
  const { isAdmin } = useAuth()
  return isAdmin ? <Admin title={adminTitle} icon={adminIcon} /> : <Aluno title={alunoTitle} icon={alunoIcon} />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Home — role-routed (admin: Dashboard, aluno: Início) */}
      <Route
        path="/"
        element={<RoleRoute adminTitle="Dashboard" alunoTitle="Início" adminIcon={LayoutDashboard} alunoIcon={Home} />}
      />

      {/* Admin (AppLayout) */}
      <Route path="/alunos" element={<Admin title="Alunos" icon={Users} />} />
      <Route path="/turmas" element={<Admin title="Aulas & Turmas" icon={Calendar} />} />
      <Route path="/particulares" element={<Admin title="Aulas Particulares" icon={Swords} />} />
      <Route path="/campeonatos" element={<Admin title="Campeonatos" icon={Trophy} />} />
      <Route path="/frequencia" element={<Admin title="Frequência" icon={ClipboardCheck} />} />
      <Route path="/financeiro" element={<Admin title="Financeiro" icon={Wallet} />} />
      <Route path="/modalidades" element={<Admin title="Modalidades" icon={Swords} />} />
      <Route path="/relatorios" element={<Admin title="Relatórios" icon={BarChart3} />} />
      <Route path="/configuracoes" element={<Admin title="Configurações" icon={Settings} />} />

      {/* Notificações — role-routed (ambos compartilham) */}
      <Route path="/notificacoes" element={<RoleRoute adminTitle="Notificações" alunoTitle="Notificações" adminIcon={Bell} alunoIcon={Bell} />} />

      {/* Aluno (AlunoLayout) */}
      <Route path="/minhas-aulas" element={<Aluno title="Minhas Aulas" icon={CalendarDays} />} />
      <Route path="/minha-frequencia" element={<Aluno title="Minha Frequência" icon={ClipboardCheck} />} />
      <Route path="/minha-evolucao" element={<Aluno title="Minha Evolução" icon={TrendingUp} />} />
      <Route path="/meus-campeonatos" element={<Aluno title="Meus Campeonatos" icon={Trophy} />} />
      <Route path="/meu-financeiro" element={<Aluno title="Meu Financeiro" icon={Wallet} />} />

      {/* Público */}
      <Route path="/pranchas" element={<EmConstrucao title="Pranchas" />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
