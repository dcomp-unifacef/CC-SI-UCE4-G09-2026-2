import { prisma } from "../database/client";

import type { CreatePresencaDto } from "../dto/presenca/createPresencaDto";
import type { UpdatePresencaDto } from "../dto/presenca/updatePresencaDto";

const includeAluno = {
  aluno: {
    select: { id: true, cpf: true, nome: true },
  },
};

export function findAll() {
  return prisma.presenca.findMany({
    include: includeAluno,
    orderBy: [{ data: "desc" }, { hora: "desc" }],
  });
}

export function findById(id: number) {
  return prisma.presenca.findUnique({ where: { id }, include: includeAluno });
}

export function findByAlunoAndData(alunoId: number, data: Date) {
  return prisma.presenca.findUnique({
    where: { alunoId_data: { alunoId, data } },
  });
}

export function create(data: CreatePresencaDto & { data: Date }) {
  return prisma.presenca.create({ data, include: includeAluno });
}

export function update(id: number, data: UpdatePresencaDto & { data?: Date }) {
  return prisma.presenca.update({ where: { id }, data, include: includeAluno });
}

export function remove(id: number) {
  return prisma.presenca.delete({ where: { id } });
}
