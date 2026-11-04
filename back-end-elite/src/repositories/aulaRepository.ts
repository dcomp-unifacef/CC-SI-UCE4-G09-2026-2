import { prisma } from "../database/client";

//cria uma nova aula
export function create(data: any) {
    return prisma.aula.create({ data });
} 

//encontra aula por id
export function findById(id: number) {
    return prisma.aula.findUnique({ where: { id }});
}

//lista todas as aulas
export function findAll() {
  return prisma.aula.findMany();
}

// Atualiza uma aula pelo id
export function updateById(id: number, data: any) {
  return prisma.aula.update({ where: { id }, data });
}

// Exclui uma aula pelo id
export function deleteById(id: number) {
  return prisma.aula.delete({ where: { id } });
}
