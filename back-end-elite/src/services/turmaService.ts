import * as repository from "../repositories/turmaRepository"


import type { Turma } from "../../generated/prisma/client"
import type { CreateTurmaDto } from "../dto/turma/createTurmaDto"

import { NotFoundError } from "../errors/NotFoundError"
import { UpdateTurmaDto } from "../dto/turma/updateTurmaDto"

export async function findAll(): Promise<Turma[]> {
    return repository.findAll();
}

export async function findById(
    id: number
): Promise<Turma> {
    const turma = await repository.findById(id);

    if(!turma) {
        throw new NotFoundError("Turma não encontrada.")
    }

    return turma;
}

export async function create(
    data: CreateTurmaDto
): Promise<Turma> {
    return repository.create(data);
}

export async function update(
    id: number,
    data: UpdateTurmaDto
): Promise<Turma> {
    await findById(id);

    return repository.update(id, data);
}

export async function remove(
    id: number
): Promise<Turma> {
    await findById(id);

    return repository.remove(id);
}