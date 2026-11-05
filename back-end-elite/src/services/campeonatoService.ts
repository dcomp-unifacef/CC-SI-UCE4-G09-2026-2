import * as repository from "../repositories/campeonatoRepository";
import * as alunoRepository from "../repositories/alunoRepository";

import type { CreateCampeonatoDto } from "../dto/campeonato/createCampeonatoDto";
import type { UpdateCampeonatoDto } from "../dto/campeonato/updateCampeonatoDto";
import type { CreateInscricaoCampeonatoDto } from "../dto/campeonato/createInscricaoCampeonatoDto";

import { AppError } from "../errors/AppError";
import { NotFoundError } from "../errors/NotFoundError";

function parseDate(value: Date | string): Date {
  const data = new Date(value);
  if (Number.isNaN(data.getTime())) throw new AppError("Data do campeonato inválida.", 400);
  return data;
}

function validateFields(data: CreateCampeonatoDto | UpdateCampeonatoDto) {
  const textFields = ["nome", "local", "locomocao", "descricao"] as const;
  for (const field of textFields) {
    if (data[field] !== undefined && !data[field]?.trim()) {
      throw new AppError(`O campo ${field} é obrigatório.`, 400);
    }
  }
  if (data.valores !== undefined && (typeof data.valores !== "number" || !Number.isFinite(data.valores) || data.valores < 0)) {
    throw new AppError("O valor do campeonato não pode ser negativo.", 400);
  }
  if (data.pesosDeLuta !== undefined) {
    if (!Array.isArray(data.pesosDeLuta)) {
      throw new AppError("As categorias de peso devem ser uma lista.", 400);
    }
    const pesos = data.pesosDeLuta.map((peso) => peso.trim()).filter(Boolean);
    if (!pesos.length) throw new AppError("Informe ao menos uma categoria de peso.", 400);
    if (new Set(pesos).size !== pesos.length) {
      throw new AppError("As categorias de peso não podem se repetir.", 400);
    }
  }
}

function clean<T extends CreateCampeonatoDto | UpdateCampeonatoDto>(data: T): T {
  return {
    ...data,
    ...(data.nome !== undefined && { nome: data.nome.trim() }),
    ...(data.local !== undefined && { local: data.local.trim() }),
    ...(data.locomocao !== undefined && { locomocao: data.locomocao.trim() }),
    ...(data.descricao !== undefined && { descricao: data.descricao.trim() }),
    ...(data.pesosDeLuta !== undefined && { pesosDeLuta: data.pesosDeLuta.map((peso) => peso.trim()) }),
  } as T;
}

export function findAll() {
  return repository.findAll();
}

export async function findById(id: number) {
  const campeonato = await repository.findById(id);
  if (!campeonato) throw new NotFoundError("Campeonato não encontrado.");
  return campeonato;
}

export async function create(data: CreateCampeonatoDto) {
  const requiredFields = ["nome", "data", "local", "locomocao", "valores", "descricao", "pesosDeLuta"] as const;
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw new AppError(`O campo ${field} é obrigatório.`, 400);
    }
  }
  validateFields(data);
  const sanitized = clean(data);
  if (await repository.findByName(sanitized.nome)) {
    throw new AppError("Campeonato já cadastrado.", 409);
  }
  return repository.create({ ...sanitized, data: parseDate(sanitized.data) });
}

export async function update(id: number, data: UpdateCampeonatoDto) {
  if (!data || Object.keys(data).length === 0) {
    throw new AppError("Informe ao menos um campo para atualizar.", 400);
  }

  await findById(id);
  validateFields(data);
  const sanitized = clean(data);
  if (sanitized.nome) {
    const existente = await repository.findByName(sanitized.nome);
    if (existente && existente.id !== id) throw new AppError("Campeonato já cadastrado.", 409);
  }
  const { data: dataInformada, ...outrosCampos } = sanitized;
  return repository.update(id, {
    ...outrosCampos,
    ...(dataInformada !== undefined && { data: parseDate(dataInformada) }),
  });
}

export async function remove(id: number) {
  await findById(id);
  return repository.remove(id);
}

export async function inscreverAluno(campeonatoId: number, data: CreateInscricaoCampeonatoDto) {
  const campeonato = await findById(campeonatoId);
  if (!Number.isInteger(data.alunoId) || data.alunoId <= 0) {
    throw new AppError("Aluno inválido.", 400);
  }
  const aluno = await alunoRepository.findById(data.alunoId);
  if (!aluno) throw new NotFoundError("Aluno não encontrado.");

  const pesoDeLuta = data.pesoDeLuta?.trim();
  if (!campeonato.pesosDeLuta.includes(pesoDeLuta)) {
    throw new AppError("Categoria de peso não pertence ao campeonato.", 400);
  }
  if (await repository.findInscricao(campeonatoId, data.alunoId)) {
    throw new AppError("Aluno já inscrito neste campeonato.", 409);
  }
  return repository.createInscricao(campeonatoId, data.alunoId, pesoDeLuta);
}

export async function removerInscricao(campeonatoId: number, alunoId: number) {
  await findById(campeonatoId);
  if (!(await repository.findInscricao(campeonatoId, alunoId))) {
    throw new NotFoundError("Inscrição não encontrada.");
  }
  return repository.removeInscricao(campeonatoId, alunoId);
}
