
import { prisma } from "../database/client";
import type { CreateAulaParticularDto } from "../dto/aulaParticular/createAulaParticularDto";
import type { UpdateAulaParticularDto } from "../dto/aulaParticular/updateAulaParticularDto";

export function findAll() {
    return prisma.aulaParticular.findMany({
        include: {
            aluno: true
        }
    });
}

export function findById(id: number) {
    return prisma.aulaParticular.findUnique({
        where: { id },
        include: {
            aluno: true
        }
    });
}

export function create(data: CreateAulaParticularDto) {
    return prisma.aulaParticular.create({
        data
    });
}

export function update(id: number, data: UpdateAulaParticularDto) {
    return prisma.aulaParticular.update({
        where: { id },
        data
    });
}

export function remove(id: number) {
    return prisma.aulaParticular.delete({
        where: { id }
    });
}
