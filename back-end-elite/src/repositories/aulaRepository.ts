import { prisma } from "../database/client"
import type { CreateAulaDto } from "../dto/aula/createAulaDto"
import type { UpdateAulaDto } from "../dto/aula/updateAulaDto"

const include = {
  professor: true,
  modalidade: true,
  turma: true,
} as const

export function findAll() {
  return prisma.aula.findMany({
    orderBy: { data: "asc" },
    include,
  })
}

export function findById(id: number) {
  return prisma.aula.findUnique({
    where: { id },
    include,
  })
}

export function create(data: CreateAulaDto) {
  const { data: dataAula, ...rest } = data as any
  return prisma.aula.create({
    data: {
      ...rest,
      data: new Date(dataAula),
      observacao: rest.observacao ?? "",
      diaSemana: rest.diaSemana ?? new Date(dataAula).getDay(),
    },
    include,
  })
}

export function update(id: number, data: UpdateAulaDto) {
  const payload: any = { ...data }
  if (payload.data) payload.data = new Date(payload.data)
  return prisma.aula.update({
    where: { id },
    data: payload,
    include,
  })
}

export function remove(id: number) {
  return prisma.aula.delete({ where: { id } })
}
