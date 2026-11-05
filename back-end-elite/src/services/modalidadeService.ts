<<<<<<< HEAD
import * as repository from "../repositories/modalidadeRepository"

import type { Modalidade } from "../../generated/prisma/client"
import type { CreateModalidadeDto } from "../dto/modalidade/createModalidadeDto"
import type { UpdateModalidadeDto } from "../dto/modalidade/updateModalidadeDto"

import { NotFoundError } from "../errors/NotFoundError"

export async function findAll(): Promise<Modalidade[]> {
=======
import * as repository from "../repositories/modalidadeRepository";

import type { modalidade } from "../../generated/prisma/client";
import type { CreateModalidadeDto } from "../dto/modalidade/createModalidadeDto";
import type { UpdateModalidadeDto } from "../dto/modalidade/updateModalidadeDto";

import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<modalidade[]> {
>>>>>>> origin/juliaM
    return repository.findAll();
}

export async function findById(
    id: number
<<<<<<< HEAD
): Promise<Modalidade> {
    const modalidade = await repository.findById(id);

    if(!modalidade) {
        throw new NotFoundError("Modalidade não encontrada.");
    }
=======
): Promise<modalidade> {
    const modalidade = await repository.findById(id);

    if (!modalidade) {
        throw new NotFoundError("Modalidade não encontrada.");
    }

>>>>>>> origin/juliaM
    return modalidade;
}

export async function create(
    data: CreateModalidadeDto
<<<<<<< HEAD
): Promise<Modalidade> {
=======
): Promise<modalidade> {
>>>>>>> origin/juliaM
    return repository.create(data);
}

export async function update(
    id: number,
    data: UpdateModalidadeDto
<<<<<<< HEAD
): Promise<Modalidade> {
=======
): Promise<modalidade> {
>>>>>>> origin/juliaM
    await findById(id);

    return repository.update(id, data);
}

export async function remove(
    id: number
<<<<<<< HEAD
): Promise<Modalidade> {
    await findById(id);
=======
): Promise<modalidade> {
    await findById(id);

>>>>>>> origin/juliaM
    return repository.remove(id);
}
