import * as repository from "../repositories/alunoRepository"

import type {Aluno} from "../../generated/prisma/client"
import type { CreateAlunoDto } from "../dto/aluno/createAlunoDto"
import type { UpdateAlunoDto } from "../dto/aluno/updateAlunoDto"

import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<Aluno[]> {
    return repository.findAll();
}

export async function findById(
    id: number
): Promise<Aluno>{
    const aluno = await repository.findById(id);
    if (!aluno){
        throw new NotFoundError("Aluno não encontrado.");
    }
    return aluno;
}

export async function create(
    data: CreateAlunoDto
): Promise<Aluno> {
    return repository.create(data);
}

export async function update(
    id: number,
    data: UpdateAlunoDto
): Promise<Aluno> {
    await findById(id);

    return repository.update(id, data);
}

export async function remove(
 id: number
): Promise<Aluno> {
    await findById(id);

    return repository.remove(id);
}