
import { prisma } from "../database/client";

import type { CreateAlunoDto }
  from "../dto/aluno/createAlunoDto.ts";

import type { UpdateAlunoDto }
  from "../dto/aluno/updateAlunoDto.ts";

export function findAll() {
  return prisma.aluno.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

export function findById(id: number) {
  return prisma.aluno.findUnique({
    where: { id },
  });
}

export function create(data: CreateAlunoDto) {
  return prisma.aluno.create({
    data,
  });
}

export function update(
  id: number,
  data: UpdateAlunoDto
) {
  return prisma.aluno.update({
    where: { id },
    data,
  });
}

export function remove(id: number) {
  return prisma.aluno.delete({
    where: { id },
  });
}

