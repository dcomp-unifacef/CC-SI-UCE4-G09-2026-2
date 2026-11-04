import { prisma } from "../database/client";

// Cria uma nova pessoa
export function create(data: any) {
  return prisma.pessoa.create({ data });
}

// Encontra um pessoa por id
export function findById(id: number) {
  return prisma.pessoa.findUnique({ where: { id } });
}

// Lista todos as pessoas
export function findAll() {
  return prisma.pessoa.findMany();
}

// Atualiza uma pessoa pelo id
export function updateById(id: number, data: any) {
  return prisma.pessoa.update({ where: { id }, data });
}

// Exclui uma pessoa pelo id
export function deleteById(id: number) {
  return prisma.pessoa.delete({ where: { id } });
}