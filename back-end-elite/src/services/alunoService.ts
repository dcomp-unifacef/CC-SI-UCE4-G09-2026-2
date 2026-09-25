import * as repositoriy from "../repositories/alunoRepository"

import type {Aluno} from "../../generated/prisma/client"
import type { CreateAlunoDto } from "../dto/aluno/createAlunoDto"
import type { UpdateAlunoDto } from "../dto/aluno/updateAlunoDto"

import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<Aluno[]> {
    return repositoriy.findAll();
}

export async function findById(
    id: number
): Promise<Aluno>{
    const aluno = await repositoriy.findById(id);
    if (!aluno){
        throw new NotFoundError("Aluno não encontrado.");
    }
    return aluno;
}

export async function create(
    data: CreateAlunoDto
): Promise<Aluno> {
    return repositoriy.create(data);
}

export async function update(
    id: number,
    data: UpdateAlunoDto
): Promise<Aluno> {
    await findById(id);

    return repositoriy.update(id, data);
}

export async function remove(
 id: number
): Promise<Aluno> {
    await findById(id);

    return repositoriy.remove(id);
}