import { prisma } from "../database/client"
import type { CreateFinanceiroDto } from "../dto/financeiro/createFinanceiroDto"
import type { UpdateFinanceiroDto } from "../dto/financeiro/updateFinanceiroDto"

const include = { aluno: { select: { id: true, nome: true, cpf: true } } } as const

export function findAll() {
  return prisma.financeiro.findMany({ orderBy: { id: "desc" }, include })
}

export function findByAluno(alunoId: number) {
  return prisma.financeiro.findMany({ where: { alunoId }, orderBy: { id: "desc" }, include })
}

export function findById(id: number) {
  return prisma.financeiro.findUnique({ where: { id }, include })
}

export function findByAlunoAndMes(alunoId: number, referenciaMes: string) {
  return prisma.financeiro.findFirst({ where: { alunoId, referenciaMes } })
}

export function create(data: CreateFinanceiroDto) {
  return prisma.financeiro.create({ data, include })
}

export function update(id: number, data: UpdateFinanceiroDto) {
  return prisma.financeiro.update({ where: { id }, data, include })
}

export function remove(id: number) {
  return prisma.financeiro.delete({ where: { id } })
}
