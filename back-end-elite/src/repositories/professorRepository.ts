import { prisma } from "../database/client"
import type { CreateProfessorDto } from "../dto/professor/createProfessorDto"
import type { UpdateProfessorDto } from "../dto/professor/updateProfessorDto"

// Include padrão — aulas com turma e modalidade para saber os vínculos
const include = {
  aulas: {
    include: {
      turma: { select: { id: true, nome: true } },
      modalidade: { select: { id: true, nome: true } },
    },
    orderBy: { data: "asc" as const },
  },
} as const

export function findAll() {
  return prisma.professor.findMany({
    orderBy: { nome: "asc" },
    include,
  })
}

export function findAllAtivos() {
  return prisma.professor.findMany({
    where: { ativo: true },
    orderBy: { nome: "asc" },
    include,
  })
}

export function findById(id: number) {
  return prisma.professor.findUnique({
    where: { id },
    include,
  })
}

export function create(data: CreateProfessorDto) {
  return prisma.professor.create({
    data: { ...data, ativo: data.ativo ?? true },
    include,
  })
}

export function update(id: number, data: UpdateProfessorDto) {
  return prisma.professor.update({
    where: { id },
    data,
    include,
  })
}

export function remove(id: number) {
  return prisma.professor.delete({ where: { id } })
}
