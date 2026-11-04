import { prisma } from "../database/client";



import type { CreateProfessorDto }
 from "../dto/professor/createProfessorDto.ts";


import type { UpdateProfessorDto }
 from "../dto/professor/updateProfessorDto.ts";




export function findAll() {
  return prisma.professor.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

export function findById(id: number) {
  return prisma.professor.findUnique({
    where: { id },
  });
}

export function create(data: CreateProfessorDto) {
  return prisma.professor.create({
    data,
  });
}

export function update(id: number, data: UpdateProfessorDto) {
  return prisma.professor.update({
    where: { id },
    data,
  });
}

export function remove(id: number) {
  return prisma.professor.delete({
    where: { id },
  });
}