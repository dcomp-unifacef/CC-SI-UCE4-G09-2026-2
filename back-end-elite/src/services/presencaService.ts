import * as repository from "../repositories/presencaRepository";
import * as alunoRepository from "../repositories/alunoRepository";

import type { CreatePresencaDto } from "../dto/presenca/createPresencaDto";
import type { UpdatePresencaDto } from "../dto/presenca/updatePresencaDto";

import { AppError } from "../errors/AppError";
import { NotFoundError } from "../errors/NotFoundError";

function normalizeDate(value: Date | string): Date {
  const data = new Date(value);
  if (Number.isNaN(data.getTime())) {
    throw new AppError("Data da presença inválida.", 400);
  }
  data.setUTCHours(0, 0, 0, 0);
  return data;
}

function validateHora(hora: string) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)) {
    throw new AppError("A hora deve estar no formato HH:mm.", 400);
  }
}

async function validateAluno(alunoId: number) {
  if (!Number.isInteger(alunoId) || alunoId <= 0) {
    throw new AppError("Aluno inválido.", 400);
  }
  if (!(await alunoRepository.findById(alunoId))) {
    throw new NotFoundError("Aluno não encontrado.");
  }
}

export function findAll() {
  return repository.findAll();
}

export async function findById(id: number) {
  const presenca = await repository.findById(id);
  if (!presenca) throw new NotFoundError("Presença não encontrada.");
  return presenca;
}

export async function create(data: CreatePresencaDto) {
  await validateAluno(data.alunoId);
  validateHora(data.hora);
  if (!data.foto?.trim()) throw new AppError("A foto é obrigatória.", 400);

  const normalizedData = normalizeDate(data.data);
  if (await repository.findByAlunoAndData(data.alunoId, normalizedData)) {
    throw new AppError("Presença já registrada.", 409);
  }

  return repository.create({ ...data, foto: data.foto.trim(), data: normalizedData });
}

export async function update(id: number, data: UpdatePresencaDto) {
  if (!data || Object.keys(data).length === 0) {
    throw new AppError("Informe ao menos um campo para atualizar.", 400);
  }

  const atual = await findById(id);
  const alunoId = data.alunoId ?? atual.alunoId;
  const normalizedData = data.data ? normalizeDate(data.data) : atual.data;

  await validateAluno(alunoId);
  if (data.hora !== undefined) validateHora(data.hora);
  if (data.foto !== undefined && !data.foto.trim()) {
    throw new AppError("A foto é obrigatória.", 400);
  }

  const duplicada = await repository.findByAlunoAndData(alunoId, normalizedData);
  if (duplicada && duplicada.id !== id) {
    throw new AppError("Presença já registrada.", 409);
  }

  return repository.update(id, {
    ...data,
    ...(data.foto !== undefined && { foto: data.foto.trim() }),
    data: normalizedData,
  });
}

export async function remove(id: number) {
  await findById(id);
  return repository.remove(id);
}
