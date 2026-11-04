import { prisma } from "../database/client";



import type { CreatePessoaDto }
 from "../dto/pessoa/createPessoaDto.ts";


import type { UpdatePessoaDto }
 from "../dto/pessoa/updatePessoaDto.ts";



export function findAll() {
  return prisma.pessoa.findMany({
    orderBy: {
      nome: "asc",
    },
  });
}

export function findById(id: number) {
  return prisma.pessoa.findUnique({
    where: { id },
  });
}

export function create(data: CreatePessoaDto) {
  return prisma.pessoa.create({
    data,
  });
}

export function update(id: number, data: UpdatePessoaDto) {
  return prisma.pessoa.update({
    where: { id },
    data,
  });
}

export function remove(id: number) {
  return prisma.pessoa.delete({
    where: { id },
  });
}