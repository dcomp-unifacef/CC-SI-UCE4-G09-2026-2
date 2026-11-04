import { prisma } from "../database/client";



import type { CreateAulaDto }
 from "../dto/aula/createAulaDto.ts";


import type { UpdateAulaDto }
 from "../dto/aula/updateAulaDto.ts";




export function findAll() {
  return prisma.aula.findMany({
    orderBy: {
      data: "asc",
    },
  });
}

export function findById(id: number) {
  return prisma.aula.findUnique({
    where: { id },
  });
}

export function create(data: CreateAulaDto) {
  return prisma.aula.create({
    data,
  });
}

export function update(id: number, data: UpdateAulaDto) {
  return prisma.aula.update({
    where: { id },
    data,
  });
}

export function remove(id: number) {
  return prisma.aula.delete({
    where: { id },
  });
}