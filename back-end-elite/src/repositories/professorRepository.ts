import { prisma } from "../database/client";

// Cria um novo professor
export function create(data: any) {
  return prisma.professor.create({ data });
}

// Encontra um professor por id
export function findById(id: number) {
  return prisma.professor.findUnique({ where: { id } });
}

// Lista todos os professores
export function findAll() {
  return prisma.professor.findMany();
}

// Atualiza um professor pelo id
export function updateById(id: number, data: any) {
  return prisma.professor.update({ where: { id }, data });
}

// Exclui um professor pelo id
export function deleteById(id: number) {
  return prisma.professor.delete({ where: { id } });
}