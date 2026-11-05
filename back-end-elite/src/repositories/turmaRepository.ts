import {prisma} from "../database/client"

import type { CreateTurmaDto } from "../dto/turma/createTurmaDto"
import type { UpdateTurmaDto } from "../dto/turma/updateTurmaDto"


export function findAll() {
    return prisma.turma.findMany({
        orderBy: {
            nome: "asc",
        },
    });
}

export function findById(id: number){
    return prisma.turma.findUnique({
        where: {id},
    });
}

export function create(data: CreateTurmaDto) {
    return prisma.turma.create({
        data,
    });
}

export function update(
    id: number,
    data: UpdateTurmaDto
) {
    return prisma.turma.update({
        where: {id},
        data,
    });
}

export function remove(id: number) {
    return prisma.turma.delete({
        where: {id},
    })
}

