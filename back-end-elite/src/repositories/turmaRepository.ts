import { prisma } from "../database/client"
import type { CreateTurmaDto } from "../dto/turma/createTurmaDto"
import type { UpdateTurmaDto } from "../dto/turma/updateTurmaDto"

const include = {
  alunos: { select: { id: true, nome: true, cpf: true } },
  modalidades: true,
  aulas: {
    include: { professor: true, modalidade: true },
    orderBy: { data: "asc" as const },
  },
} as const

export function findAll() {
  return prisma.turma.findMany({
    orderBy: { nome: "asc" },
    include,
  })
}

export function findById(id: number) {
  return prisma.turma.findUnique({
    where: { id },
    include,
  })
}

export function create(data: CreateTurmaDto) {
  const { alunoIds, ...rest } = data
  return prisma.turma.create({
    data: {
      ...rest,
      ...(alunoIds?.length
        ? { alunos: { connect: alunoIds.map((id) => ({ id })) } }
        : {}),
    },
    include,
  })
}

export function update(id: number, data: UpdateTurmaDto) {
  const { alunoIds, ...rest } = data
  return prisma.turma.update({
    where: { id },
    data: {
      ...rest,
      ...(alunoIds !== undefined
        ? { alunos: { set: alunoIds.map((id) => ({ id })) } }
        : {}),
    },
    include,
  })
}

export function remove(id: number) {
  return prisma.turma.delete({ where: { id } })
}
