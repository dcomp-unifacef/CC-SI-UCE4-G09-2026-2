import { prisma } from "../database/client";

import type { CreateCampeonatoDto } from "../dto/campeonato/createCampeonatoDto";
import type { UpdateCampeonatoDto } from "../dto/campeonato/updateCampeonatoDto";

const includeInscricoes = {
  inscricoes: {
    include: {
      aluno: { select: { id: true, cpf: true, nome: true } },
    },
  },
};

export function findAll() {
  return prisma.campeonato.findMany({
    include: includeInscricoes,
    orderBy: { data: "asc" },
  });
}

export function findById(id: number) {
  return prisma.campeonato.findUnique({ where: { id }, include: includeInscricoes });
}

export function findByName(nome: string) {
  return prisma.campeonato.findUnique({ where: { nome } });
}

export function create(data: CreateCampeonatoDto & { data: Date }) {
  return prisma.campeonato.create({ data, include: includeInscricoes });
}

export function update(id: number, data: UpdateCampeonatoDto & { data?: Date }) {
  return prisma.campeonato.update({ where: { id }, data, include: includeInscricoes });
}

export function remove(id: number) {
  return prisma.campeonato.delete({ where: { id } });
}

export function findInscricao(campeonatoId: number, alunoId: number) {
  return prisma.inscricaoCampeonato.findUnique({
    where: { campeonatoId_alunoId: { campeonatoId, alunoId } },
  });
}

export function createInscricao(campeonatoId: number, alunoId: number, pesoDeLuta: string) {
  return prisma.inscricaoCampeonato.create({
    data: { campeonatoId, alunoId, pesoDeLuta },
    include: { aluno: { select: { id: true, cpf: true, nome: true } } },
  });
}

export function removeInscricao(campeonatoId: number, alunoId: number) {
  return prisma.inscricaoCampeonato.delete({
    where: { campeonatoId_alunoId: { campeonatoId, alunoId } },
  });
}
