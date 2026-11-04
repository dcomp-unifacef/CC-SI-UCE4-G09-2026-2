import * as repository from "../repositories/professorRepository";

import type { Professor } from "../../generated/prisma/client.ts";
import type { CreateProfessorDto } from "../dto/professor/createProfessorDto.ts";
import type { UpdateProfessorDto } from "../dto/professor/updateProfessorDto.ts";

import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<Professor[]> {
  return repository.findAll();  
}

export async function findById(id: number): Promise<Professor> {
  const professor = await repository.findById(id);

  if (!professor) {
    throw new NotFoundError("Professor não encontrado.");
  }

  return professor;
}

export async function create(data: CreateProfessorDto): Promise<Professor> {
  return repository.create(data);
}

export async function update(id: number, data: UpdateProfessorDto): Promise<Professor> {
  await findById(id);

  return repository.update(id, data);
}

export async function remove(id: number): Promise<Professor> {
  await findById(id);

  return repository.remove(id);
}