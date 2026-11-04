import * as repository from "../repositories/aulaRepository";

import type { Aula } from "../../generated/prisma/client.ts";
import type { CreateAulaDto } from "../dto/aula/createAulaDto.ts";
import type { UpdateAulaDto } from "../dto/aula/updateAulaDto.ts";

import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<Aula[]> {
  return repository.findAll();
}

export async function findById(id: number): Promise<Aula> {
  const aula = await repository.findById(id);

  if (!aula) {
    throw new NotFoundError("Aula não encontrada.");
  }

  return aula;
}

export async function create(data: CreateAulaDto): Promise<Aula> {
  return repository.create(data);
}

export async function update(id: number, data: UpdateAulaDto): Promise<Aula> {
  await findById(id);

  return repository.update(id, data);
}

export async function remove(id: number): Promise<Aula> {
  await findById(id);

  return repository.remove(id);
}