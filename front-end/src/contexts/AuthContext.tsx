import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export type AppRole = 'admin' | 'aluno'

export interface MockUser {
  id: string
  nome: string
  email: string
  role: AppRole
  alunoId?: string
}

interface AuthCtx {
  user: MockUser | null
  loading: boolean
  loginAs: (role: AppRole) => void
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => void
  isAdmin: boolean
  isAluno: boolean
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

const STORAGE_KEY = 'efc_mock_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      /* ignora JSON inválido */
    }
    setLoading(false)
  }, [])

  const persist = (u: MockUser | null) => {
    setUser(u)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const loginAs = (role: AppRole) => {
    persist(
      role === 'admin'
        ? { id: 'u-admin', nome: 'Mestre EFC', email: 'admin@elitefight.club', role: 'admin' }
        : { id: 'u-aluno', nome: 'Fernanda Lima', email: 'fernanda@efc.com', role: 'aluno', alunoId: 'a2' },
    )
  }

  // Mock: qualquer credencial entra; admin se o email contiver "admin".
  const signIn = async (email: string, _password: string) => {
    const role: AppRole = email.toLowerCase().includes('admin') ? 'admin' : 'aluno'
    loginAs(role)
    return { error: null }
  }

  const signOut = () => persist(null)

  return (
    <AuthContext.Provider
      value={{ user, loading, loginAs, signIn, signOut, isAdmin: user?.role === 'admin', isAluno: user?.role === 'aluno' }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
