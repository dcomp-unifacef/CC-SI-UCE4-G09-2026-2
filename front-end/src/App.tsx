import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import type { ReactNode } from 'react'

import AppLayout    from './components/AppLayout'
import AlunoLayout  from './components/AlunoLayout'

// Páginas compartilhadas
import Login       from './pages/Login'
import NotFound    from './pages/NotFound'
import Notificacoes from './pages/Notificacoes'

// Páginas admin
import Dashboard    from './pages/Dashboard'
import Alunos       from './pages/Alunos'
import Turmas       from './pages/Turmas'
import Campeonatos  from './pages/Campeonatos'
import Frequencia   from './pages/Frequencia'
import Financeiro   from './pages/Financeiro'
import Modalidades  from './pages/Modalidades'
import Relatorios   from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'
import Particulares from './pages/Particulares'
import Professores  from './pages/Professores'

// Páginas aluno
import AlunoInicio       from './pages/aluno/Inicio'
import MinhasAulas       from './pages/aluno/MinhasAulas'
import MinhaFrequencia   from './pages/aluno/MinhaFrequencia'
import MinhaEvolucao     from './pages/aluno/MinhaEvolucao'
import MeusCampeonatos   from './pages/aluno/MeusCampeonatos'
import MeuFinanceiro     from './pages/aluno/MeuFinanceiro'

// ----------------------------------------------------------------
// Guardas de rota
// ----------------------------------------------------------------

/** Rota que requer auth — redireciona para /login se não autenticado */
function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

/** Envolve em AppLayout (admin) */
function Admin({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}

/** Envolve em AlunoLayout */
function Aluno({ children }: { children: ReactNode }) {
  return <AlunoLayout>{children}</AlunoLayout>
}

/**
 * Home: admin → Dashboard, aluno → AlunoInicio.
 * Usuários sem papel definido caem no dashboard.
 */
function HomeRoute() {
  const { isAdmin } = useAuth()
  return isAdmin ? (
    <Admin><Dashboard /></Admin>
  ) : (
    <Aluno><AlunoInicio /></Aluno>
  )
}

/**
 * Notificações: ambos os papéis acessam, mas com layout diferente.
 */
function NotificacoesRoute() {
  const { isAdmin } = useAuth()
  return isAdmin ? (
    <Admin><Notificacoes /></Admin>
  ) : (
    <Aluno><Notificacoes /></Aluno>
  )
}

// ----------------------------------------------------------------
// Rotas
// ----------------------------------------------------------------
function AppRoutes() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<Login />} />

      {/* Home — papel determina o layout */}
      <Route path="/" element={<Protected><HomeRoute /></Protected>} />

      {/* Notificações — ambos os papéis */}
      <Route path="/notificacoes" element={<Protected><NotificacoesRoute /></Protected>} />

      {/* Admin */}
      <Route path="/alunos"      element={<Protected><Admin><Alunos /></Admin></Protected>} />
      <Route path="/turmas"      element={<Protected><Admin><Turmas /></Admin></Protected>} />
      <Route path="/campeonatos" element={<Protected><Admin><Campeonatos /></Admin></Protected>} />
      <Route path="/frequencia"  element={<Protected><Admin><Frequencia /></Admin></Protected>} />
      <Route path="/financeiro"  element={<Protected><Admin><Financeiro /></Admin></Protected>} />
      <Route path="/modalidades" element={<Protected><Admin><Modalidades /></Admin></Protected>} />
      <Route path="/relatorios"  element={<Protected><Admin><Relatorios /></Admin></Protected>} />
      <Route path="/configuracoes" element={<Protected><Admin><Configuracoes /></Admin></Protected>} />
      <Route path="/particulares"  element={<Protected><Admin><Particulares /></Admin></Protected>} />
      <Route path="/professores"   element={<Protected><Admin><Professores /></Admin></Protected>} />

      {/* Aluno */}
      <Route path="/minhas-aulas"    element={<Protected><Aluno><MinhasAulas /></Aluno></Protected>} />
      <Route path="/minha-frequencia" element={<Protected><Aluno><MinhaFrequencia /></Aluno></Protected>} />
      <Route path="/minha-evolucao"  element={<Protected><Aluno><MinhaEvolucao /></Aluno></Protected>} />
      <Route path="/meus-campeonatos" element={<Protected><Aluno><MeusCampeonatos /></Aluno></Protected>} />
      <Route path="/meu-financeiro"  element={<Protected><Aluno><MeuFinanceiro /></Aluno></Protected>} />

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
