import { prisma } from "../database/client"
import type { CreateNotificacaoDto } from "../dto/notificacao/createNotificacaoDto"
import type { UpdateNotificacaoDto } from "../dto/notificacao/updateNotificacaoDto"

const include = { aluno: { select: { id: true, nome: true } } } as const

export function findAll() {
  return prisma.notificacao.findMany({ orderBy: { data: "desc" }, include })
}

export function findByAluno(alunoId: number) {
  return prisma.notificacao.findMany({
    where: { alunoId },
    orderBy: { data: "desc" },
    include,
  })
}

export function findById(id: number) {
  return prisma.notificacao.findUnique({ where: { id }, include })
}

export function create(data: CreateNotificacaoDto) {
  return prisma.notificacao.create({ data, include })
}

export function update(id: number, data: UpdateNotificacaoDto) {
  return prisma.notificacao.update({ where: { id }, data, include })
}

export function marcarTodasLidas() {
  return prisma.notificacao.updateMany({ where: { lida: false }, data: { lida: true } })
}

export function remove(id: number) {
  return prisma.notificacao.delete({ where: { id } })
}
