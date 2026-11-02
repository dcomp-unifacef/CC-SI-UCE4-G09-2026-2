import { prisma } from "../database/client";

import type { CreateHorarioDto }
    from "../dto/horario/createHorarioDto";

import type { UpdateHorarioDto }
    from "../dto/horario/updateHorarioDto";

export function findAll() {
    return prisma.horario.findMany({
        orderBy: {
            diaSemana: "asc",
        },
    });
}

export function findById(id: number) {
    return prisma.horario.findUnique({
        where: { id },
    });
}

export function create(data: CreateHorarioDto) {
    return prisma.horario.create({
        data,
    });
}

export function update(
    id: number,
    data: UpdateHorarioDto
) {
    return prisma.horario.update({
        where: { id },
        data,
    });
}

export function remove(id: number) {
    return prisma.horario.delete({
        where: { id },
    });
}
