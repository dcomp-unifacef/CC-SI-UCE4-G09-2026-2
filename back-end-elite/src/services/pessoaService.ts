import * as repository from "../repositories/pessoaRepository";

import type { Pessoa } from "../../generated/prisma/client.ts";
import type { CreatePessoaDto } from "../dto/pessoa/createPessoaDto.ts";
import type { UpdatePessoaDto } from "../dto/pessoa/updatePessoaDto.ts";

import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<Pessoa[]> {
  return repository.findAll();
}

export async function findById(id: number): Promise<Pessoa> {
  const pessoa = await repository.findById(id);

  if (!pessoa) {
    throw new NotFoundError("Pessoa não encontrada.");
  }

  return pessoa;
}

export async function create(data: CreatePessoaDto): Promise<Pessoa> {
  return repository.create(data);
}

export async function update(id: number, data: UpdatePessoaDto): Promise<Pessoa> {
  await findById(id);

  return repository.update(id, data);
}

export async function remove(id: number): Promise<Pessoa> {
  await findById(id);

  return repository.remove(id);
}