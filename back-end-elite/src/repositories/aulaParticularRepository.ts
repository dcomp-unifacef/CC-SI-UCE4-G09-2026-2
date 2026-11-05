
import { prisma } from "../database/client";

import type { CreateAulaParticularDto } from "../dto/aulaParticular/createAulaParticularDto";
import type { UpdateAulaParticularDto } from "../dto/aulaParticular/updateAulaParticularDto";
import type { AgendarRecorrenteDto } from "../dto/aulaParticular/agendarRecorrenteDto";

export function findAll() {
    return prisma.aulaParticular.findMany({
        include: { aluno: true }
    });
}

export function findById(id: number) {
    return prisma.aulaParticular.findUnique({
        where: { id },
        include: { aluno: true }
    });
}

export function create(data: CreateAulaParticularDto) {
    return prisma.aulaParticular.create({
        data
    });
}

export function update(
    id: number,
    data: UpdateAulaParticularDto
) {
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

export function agendar(data: CreateAulaParticularDto) {
    return prisma.aulaParticular.create({
        data: {
            ...data,
            status: "AGENDADA",
            presenca: null
        }
    });
}

export function cancelar(id: number) {
    return prisma.aulaParticular.update({
        where: { id },
        data: {
            status: "CANCELADA",
            presenca: null
        }
    });
}

export function registrar(
    id: number,
    presenca: boolean
) {
    return prisma.aulaParticular.update({
        where: { id },
        data: {
            presenca,
            status: "CONCLUIDA"
        }
    });
}

// Busca conflitos de agendamento do aluno.
export function findConflito(
    alunoId: number,
    data: string,
    horario: string,
    ignorarId?: number
) {
    return prisma.aulaParticular.findFirst({
        where: {
            alunoId,
            data,
            horario,
            status: {
                not: "CANCELADA"
            },
            ...(ignorarId !== undefined
                ? { id: { not: ignorarId } }
                : {})
        }
    });
}

// Cria uma recorrência e suas aulas em uma transação.
export function agendarRecorrente(
    dados: AgendarRecorrenteDto,
    aulas: CreateAulaParticularDto[]
) {
    return prisma.$transaction(async (tx) => {
        const recorrencia =
            await tx.recorrenciaAulaParticular.create({
                data: {
                    alunoId: dados.alunoId,
                    dataInicio: dados.dataInicio,
                    dataFim: dados.dataFim,
                    diasSemana: dados.diasSemana,
                    horario: dados.horario
                }
            });

        await tx.aulaParticular.createMany({
            data: aulas.map(aula => ({
                ...aula,
                recorrenciaId: recorrencia.id,
                status: "AGENDADA" as const,
                presenca: null
            }))
        });

        return tx.recorrenciaAulaParticular.findUniqueOrThrow({
            where: { id: recorrencia.id },
            include: {
                aulas: {
                    orderBy: [
                        { data: "asc" },
                        { horario: "asc" }
                    ]
                }
            }
        });
    });
}

export function findRecorrenciaById(id: number) {
    return prisma.recorrenciaAulaParticular.findUnique({
        where: { id },
        include: { aulas: true }
    });
}

export function cancelarRecorrencia(
    recorrenciaId: number,
    dataAtual: string,
    horarioAtual: string
) {
    return prisma.aulaParticular.updateMany({
        where: {
            recorrenciaId,
            status: "AGENDADA",
            OR: [
                { data: { gt: dataAtual } },
                {
                    data: dataAtual,
                    horario: { gt: horarioAtual }
                }
            ]
        },
        data: {
            status: "CANCELADA",
            presenca: null
        }
    });
}
