import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { authApi, setUnauthorizedHandler, getToken, setToken, clearToken } from '../services/api'
import type { UsuarioAPI } from '../services/api'

export type AppRole = 'admin' | 'aluno'

export interface AppUser {
  id: number
  nome: string
  email: string
  role: AppRole
}

interface AuthCtx {
  user: AppUser | null
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
  isAluno: boolean
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

function toAppUser(u: UsuarioAPI): AppUser {
  return { id: u.id, nome: u.nome, email: u.email, role: u.papel === 'ADMIN' ? 'admin' : 'aluno' }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Recupera a sessão via /auth/me se houver token
  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    authApi.me()
      .then((u) => setUser(toAppUser(u)))
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  // Registra o handler de 401 (limpa sessão e força reload para ir ao login)
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
      // O <Protected> vai redirecionar automaticamente ao /login
    })
  }, [])

  const login = async (email: string, senha: string) => {
    const { token, usuario } = await authApi.login(email, senha)
    setToken(token)
    setUser(toAppUser(usuario))
  }

  const cadastrar = async (nome: string, email: string, senha: string) => {
    const { token, usuario } = await authApi.cadastro(nome, email, senha)
    setToken(token)
    setUser(toAppUser(usuario))
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        cadastrar,
        logout,
        isAdmin: user?.role === 'admin',
        isAluno: user?.role === 'aluno',
      }}
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
