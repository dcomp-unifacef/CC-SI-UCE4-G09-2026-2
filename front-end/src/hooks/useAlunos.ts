import { useState, useEffect, useCallback } from 'react'
import { alunosApi } from '../services/api'
import type { AlunoAPI } from '../services/api'

export function useAlunos() {
  const [alunos, setAlunos]   = useState<AlunoAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro]       = useState<string | null>(null)

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro(null)
    try {
      const data = await alunosApi.listar()
      setAlunos(data)
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao carregar alunos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const criar = async (data: Omit<AlunoAPI, 'id'>) => {
    const novo = await alunosApi.criar(data)
    setAlunos((prev) => [...prev, novo].sort((a, b) => a.nome.localeCompare(b.nome)))
    return novo
  }

  const atualizar = async (id: number, data: Partial<Omit<AlunoAPI, 'id'>>) => {
    const atualizado = await alunosApi.atualizar(id, data)
    setAlunos((prev) => prev.map((a) => (a.id === id ? atualizado : a)))
    return atualizado
  }

  const excluir = async (id: number) => {
    await alunosApi.excluir(id)
    setAlunos((prev) => prev.filter((a) => a.id !== id))
  }

  return { alunos, loading, erro, carregar, criar, atualizar, excluir }
}
