import * as repository from "../repositories/modalidadeRepository"

import type { Modalidade } from "../../generated/prisma/client"
import type { CreateModalidadeDto } from "../dto/modalidade/createModalidadeDto"
import type { UpdateModalidadeDto } from "../dto/modalidade/updateModalidadeDto"

import { NotFoundError } from "../errors/NotFoundError"

export async function findAll(): Promise<Modalidade[]> {
    return repository.findAll();
}

export async function findById(
    id: number
): Promise<Modalidade> {
    const modalidade = await repository.findById(id);

    if(!modalidade) {
        throw new NotFoundError("Modalidade não encontrada.");
    }
    return modalidade;
}

export async function create(
    data: CreateModalidadeDto
): Promise<Modalidade> {
    return repository.create(data);
}

export async function update(
    id: number,
    data: UpdateModalidadeDto
): Promise<Modalidade> {
    await findById(id);

    return repository.update(id, data);
}

export async function remove(
    id: number
): Promise<Modalidade> {
    await findById(id);
    return repository.remove(id);
}
