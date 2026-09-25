import * as repository from "../repositories/evolucaoRepositoy"


import type { Evolucao } from "../../generated/prisma/client"
import type { CreateEvolucaoDto } from "../dto/evolucao/createEvolucaoDto"
import type { UpdateEvolucaoDto } from "../dto/evolucao/updateEvolucaoDto"

import { NotFoundError } from "../errors/NotFoundError"

export async function findAll(): Promise<Evolucao[]> {
    return repository.findAll();
}

export async function findById(
    id: number
): Promise<Evolucao> {
    const evolucao = await repository.findById(id);

    if(!evolucao){
        throw new NotFoundError("Evolução não encontrada.");
    }
    return evolucao;
}

export async function create(
    data: CreateEvolucaoDto
): Promise<Evolucao> {
    return repository.create(data);

}

export async function update(
    id: number,
    data: UpdateEvolucaoDto
): Promise<Evolucao> {
    await findById(id);
    return repository.update(id, data);
}

export async function remove(
    id: number
): Promise<Evolucao>{
    await findById(id);

    return repository.remove(id);
}