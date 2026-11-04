import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as service from "../services/aulaService";

import type { CreateAulaDto } from "../dto/aula/createAulaDto.ts";
import type { UpdateAulaDto } from "../dto/aula/updateAulaDto.ts";

type AulaIdParams = {
  id: string;
};

type CreateAulaRequest = Request<
  Record<string, never>,
  unknown,
  CreateAulaDto
>;

type UpdateAulaRequest = Request<
  AulaIdParams,
  unknown,
  UpdateAulaDto
>;

export async function retrieveAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const aulas = await service.findAll();

    res.json(aulas);
  }
  catch (error) {
    next(error);
  }
}

export async function retrieveOne(
  req: Request<AulaIdParams>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const aula = await service.findById(id);

    res.json(aula);
  }
  catch (error) {
    next(error);
  }
}

export async function create(
  req: CreateAulaRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const aula = await service.create(req.body);

    res.status(201).json(aula);
  }
  catch (error) {
    next(error);
  }
}

export async function update(
  req: UpdateAulaRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const aula = await service.update(
      id,
      req.body
    );

    res.json(aula);
  }
  catch (error) {
    next(error);
  }
}

export async function remove(
  req: Request<AulaIdParams>,
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