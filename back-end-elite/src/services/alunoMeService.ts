import * as repository from "../repositories/alunoRepository"
import * as presencaRepository from "../repositories/presencaRepository"
import type { Aluno } from "../../generated/prisma/client"

// Campos que o aluno pode editar no próprio perfil
const CAMPOS_EDITAVEIS = ['telefone'] as const
type CampoEditavel = typeof CAMPOS_EDITAVEIS[number]

export async function obterPerfil(alunoId: number): Promise<Aluno> {
  const aluno = await repository.findById(alunoId)
  if (!aluno) throw new Error("Aluno não encontrado.") // nunca acontece, já foi carregado
  return aluno
}

export async function atualizarPerfil(alunoId: number, dados: Partial<Record<string, unknown>>): Promise<Aluno> {
  // Whitelist: só aceitar campos editáveis
  const dadosFiltrados: Record<string, any> = {}
  for (const campo of CAMPOS_EDITAVEIS) {
    if (campo in dados) {
      ;(dadosFiltrados as any)[campo] = dados[campo]
    }
  }

  return repository.update(alunoId, dadosFiltrados as any)
}

export async function obterFrequencia(alunoId: number) {
  return presencaRepository.findByAlunoId(alunoId)
}

export async function obterAulas(alunoId: number) {
  const aluno = await repository.findById(alunoId)
  if (!aluno) throw new Error("Aluno não encontrado.")
  
  const { prisma } = await import("../database/client")
  
  // Buscar aulas futuras das modalidades do aluno
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  
  const aulas = await prisma.aula.findMany({
    where: {
      data: { gte: hoje },
      modalidade: { nome: { in: aluno.modalidades } },
    },
    include: {
      professor: { select: { id: true, nome: true } },
      modalidade: { select: { id: true, nome: true } },
      turma: { select: { id: true, nome: true } },
    },
    orderBy: { data: "asc" },
    take: 10, // Limitar a 10 próximas aulas
  })
  
  return aulas
}

export async function obterFinanceiro(alunoId: number) {
  const { prisma } = await import("../database/client")
  
  return prisma.financeiro.findMany({
    where: { alunoId },
    orderBy: { id: "desc" },
  })
}

export async function obterEvolucoes(alunoId: number) {
  const { prisma } = await import("../database/client")
  
  return prisma.evolucao.findMany({
    where: { alunoId },
    orderBy: { dataAvaliacao: "asc" },
  })
}

export async function criarEvolucao(
  alunoId: number,
  dados: { pesoAtual: number; bioimpedancia: number; dataAvaliacao?: string }
) {
  const { prisma } = await import("../database/client")
  
  // Whitelist: apenas pesoAtual, bioimpedancia e dataAvaliacao
  const dataAvaliacao = dados.dataAvaliacao 
    ? new Date(dados.dataAvaliacao) 
    : new Date()
  
  return prisma.evolucao.create({
    data: {
      alunoId,
      pesoAtual: dados.pesoAtual,
      bioimpedancia: dados.bioimpedancia,
      dataAvaliacao,
    },
  })
}

export async function obterCampeonatos(alunoId: number) {
  const { prisma } = await import("../database/client")
  
  // Buscar inscrições do aluno com os dados do campeonato
  const inscricoes = await prisma.inscricaoCampeonato.findMany({
    where: { alunoId },
    include: {
      campeonato: true,
    },
    orderBy: {
      campeonato: { data: "desc" },
    },
  })
  
  return inscricoes
}

export async function obterNotificacoes(alunoId: number) {
  const { prisma } = await import("../database/client")
  
  return prisma.notificacao.findMany({
    where: { alunoId },
    orderBy: [
      { lida: "asc" },  // Não lidas primeiro
      { data: "desc" },  // Mais recentes primeiro
    ],
  })
}

export async function marcarNotificacaoLida(alunoId: number, notificacaoId: number) {
  const { prisma } = await import("../database/client")
  
  // Verificar se a notificação pertence ao aluno antes de marcar
  const notificacao = await prisma.notificacao.findUnique({
    where: { id: notificacaoId },
  })
  
  if (!notificacao || notificacao.alunoId !== alunoId) {
    throw new Error("Notificação não encontrada.")
  }
  
  return prisma.notificacao.update({
    where: { id: notificacaoId },
    data: { lida: true },
  })
}

export async function marcarTodasNotificacoesLidas(alunoId: number) {
  const { prisma } = await import("../database/client")
  
  const resultado = await prisma.notificacao.updateMany({
    where: { alunoId, lida: false },
    data: { lida: true },
  })
  
  return { atualizadas: resultado.count }
}
