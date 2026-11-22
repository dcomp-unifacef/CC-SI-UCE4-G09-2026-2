import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import type { ReactNode } from 'react'

import AppLayout    from './components/AppLayout'
import AlunoLayout  from './components/AlunoLayout'

// Páginas compartilhadas
import Login            from './pages/Login'
import Cadastro         from './pages/Cadastro'
import EsqueciSenha     from './pages/EsqueciSenha'
import RedefinirSenha   from './pages/RedefinirSenha'
import NotFound         from './pages/NotFound'
import Notificacoes     from './pages/Notificacoes'

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

/** Rota protegida genérica — redireciona a /login se não autenticado */
function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

/** Rota só de ADMIN — aluno é redirecionado ao painel de aluno */
function RotaAdmin({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <AppLayout>{children}</AppLayout>
}

/** Rota só de ALUNO — admin é redirecionado ao painel admin */
function RotaAluno({ children }: { children: ReactNode }) {
  const { user, loading, isAluno } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAluno) return <Navigate to="/" replace />
  return <AlunoLayout>{children}</AlunoLayout>
}

/**
 * Home: admin → Dashboard, aluno → AlunoInicio.
 */
function HomeRoute() {
  const { isAdmin } = useAuth()
  return isAdmin ? (
    <AppLayout><Dashboard /></AppLayout>
  ) : (
    <AlunoLayout><AlunoInicio /></AlunoLayout>
  )
}

/**
 * Notificações: ambos os papéis acessam, mas com layout diferente.
 */
function NotificacoesRoute() {
  const { isAdmin } = useAuth()
  return isAdmin ? (
    <AppLayout><Notificacoes /></AppLayout>
  ) : (
    <AlunoLayout><Notificacoes /></AlunoLayout>
  )
}

// ----------------------------------------------------------------
// Rotas
// ----------------------------------------------------------------
function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />

      {/* Home — papel determina o layout */}
      <Route path="/" element={<Protected><HomeRoute /></Protected>} />

      {/* Notificações — ambos os papéis */}
      <Route path="/notificacoes" element={<Protected><NotificacoesRoute /></Protected>} />

      {/* Admin */}
      <Route path="/alunos"      element={<RotaAdmin><Alunos /></RotaAdmin>} />
      <Route path="/turmas"      element={<RotaAdmin><Turmas /></RotaAdmin>} />
      <Route path="/campeonatos" element={<RotaAdmin><Campeonatos /></RotaAdmin>} />
      <Route path="/frequencia"  element={<RotaAdmin><Frequencia /></RotaAdmin>} />
      <Route path="/financeiro"  element={<RotaAdmin><Financeiro /></RotaAdmin>} />
      <Route path="/modalidades" element={<RotaAdmin><Modalidades /></RotaAdmin>} />
      <Route path="/relatorios"  element={<RotaAdmin><Relatorios /></RotaAdmin>} />
      <Route path="/configuracoes" element={<RotaAdmin><Configuracoes /></RotaAdmin>} />
      <Route path="/particulares"  element={<RotaAdmin><Particulares /></RotaAdmin>} />
      <Route path="/professores"   element={<RotaAdmin><Professores /></RotaAdmin>} />

      {/* Aluno */}
      <Route path="/minhas-aulas"    element={<RotaAluno><MinhasAulas /></RotaAluno>} />
      <Route path="/minha-frequencia" element={<RotaAluno><MinhaFrequencia /></RotaAluno>} />
      <Route path="/minha-evolucao"  element={<RotaAluno><MinhaEvolucao /></RotaAluno>} />
      <Route path="/meus-campeonatos" element={<RotaAluno><MeusCampeonatos /></RotaAluno>} />
      <Route path="/meu-financeiro"  element={<RotaAluno><MeuFinanceiro /></RotaAluno>} />

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
