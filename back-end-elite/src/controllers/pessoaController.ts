import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as service from "../services/pessoaService";

import type { CreatePessoaDto } from "../dto/pessoa/createPessoaDto.ts";
import type { UpdatePessoaDto } from "../dto/pessoa/updatePessoaDto.ts";

type PessoaIdParams = {
  id: string;
};

type CreatePessoaRequest = Request<
  Record<string, never>,
  unknown,
  CreatePessoaDto
>;

type UpdatePessoaRequest = Request<
  PessoaIdParams,
  unknown,
  UpdatePessoaDto
>;

export async function retrieveAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pessoas = await service.findAll();

    res.json(pessoas);
  }
  catch (error) {
    next(error);
  }
}

export async function retrieveOne(
  req: Request<PessoaIdParams>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const pessoa = await service.findById(id);

    res.json(pessoa);
  }
  catch (error) {
    next(error);
  }
}

export async function create(
  req: CreatePessoaRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const pessoa = await service.create(req.body);

    res.status(201).json(pessoa);
  }
  catch (error) {
    next(error);
  }
}

export async function update(
  req: UpdatePessoaRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const pessoa = await service.update(
      id,
      req.body
    );

    res.json(pessoa);
  }
  catch (error) {
    next(error);
  }
}

export async function remove(
  req: Request<PessoaIdParams>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    await service.remove(id);

    res.status(204).end();
  }
  catch (error) {
    next(error);
  }
}