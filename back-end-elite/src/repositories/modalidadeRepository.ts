<<<<<<< HEAD
import {prisma} from "../database/client";

import type { CreateModalidadeDto } from "../dto/modalidade/createModalidadeDto";
import type { UpdateModalidadeDto } from "../dto/modalidade/updateModalidadeDto";
=======
import { prisma } from "../database/client";

import type { CreateModalidadeDto }
    from "../dto/modalidade/createModalidadeDto";

import type { UpdateModalidadeDto }
    from "../dto/modalidade/updateModalidadeDto";
>>>>>>> origin/juliaM

export function findAll() {
    return prisma.modalidade.findMany({
        orderBy: {
            nome: "asc",
        },
    });
}

export function findById(id: number) {
    return prisma.modalidade.findUnique({
        where: { id },
    });
}

<<<<<<< HEAD
export function create (data: CreateModalidadeDto) {
=======
export function create(data: CreateModalidadeDto) {
>>>>>>> origin/juliaM
    return prisma.modalidade.create({
        data,
    });
}

export function update(
    id: number,
    data: UpdateModalidadeDto
) {
    return prisma.modalidade.update({
        where: { id },
        data,
    });
}

<<<<<<< HEAD
export function remove(id: number){
    return prisma.modalidade.delete({
        where: { id },
    })
}
=======
export function remove(id: number) {
    return prisma.modalidade.delete({
        where: { id },
    });
}
>>>>>>> origin/juliaM
