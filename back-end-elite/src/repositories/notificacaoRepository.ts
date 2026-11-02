import { prisma } from "../database/client"

import type { CreateNotificacaoDto } from "../dto/notificacao/createNotificacaoDto"
import type { UpdateNotificacaoDto } from "../dto/notificacao/updateNotificacaoDto"

export function findAll() {
    return prisma.notificacao.findMany({
        orderBy: {
            tipoNotificacao: "asc",
        },
    });
}

export function findById(id: number) {
 return prisma.notificacao.findUnique({
   where: { id },
 });
}


export function create(data: CreateNotificacaoDto) {
 return prisma.notificacao.create({
   data,
 });
}


export function update(
 id: number,
 data: UpdateNotificacaoDto
) {
 return prisma.notificacao.update({
   where: { id },
   data,
 });
}


export function remove(id: number) {
 return prisma.notificacao.delete({
   where: { id },
 });
}
