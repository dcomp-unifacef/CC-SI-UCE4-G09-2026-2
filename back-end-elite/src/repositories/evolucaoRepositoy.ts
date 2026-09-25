
import { prisma } from "../database/client";

import type { CreateEvolucaoDto }
  from "../dto/evolucao/createEvolucaoDto.ts";

import type { UpdateEvolucaoDto }
  from "../dto/evolucao/updateEvolucaoDto.ts";

export function findAll() {
  return prisma.evolucao.findMany({
    orderBy: {
      dataAvaliacao: "desc",
    },
  });
}

export function findById(id: number) {
  return prisma.evolucao.findUnique({
    where: { id },
  });
}

export function create(data: CreateEvolucaoDto) {
  return prisma.evolucao.create({
    data,
  });
}

export function update(
  id: number,
  data: UpdateEvolucaoDto
) {
  return prisma.evolucao.update({
    where: { id },
    data,
  });
}

export function remove(id: number) {
  return prisma.evolucao.delete({
    where: { id },
  });
}
