import type {
  Request,
  Response,
  NextFunction,
} from "express";

import * as service from "../services/professorService";

import type { CreateProfessorDto } from "../dto/professor/createProfessorDto.ts";
import type { UpdateProfessorDto } from "../dto/professor/updateProfessorDto.ts";

type ProfessorIdParams = {
  id: string;
};

type CreateProfessorRequest = Request<
  Record<string, never>,
  unknown,
  CreateProfessorDto
>;

type UpdateProfessorRequest = Request<
  ProfessorIdParams,
  unknown,
  UpdateProfessorDto
>;

export async function retrieveAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const professores = await service.findAll();

    res.json(professores);
  }
  catch (error) {
    next(error);
  }
}

export async function retrieveOne(
  req: Request<ProfessorIdParams>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const professor = await service.findById(id);

    res.json(professor);
  }
  catch (error) {
    next(error);
  }
}

export async function create(
  req: CreateProfessorRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const professor = await service.create(req.body);

    res.status(201).json(professor);
  }
  catch (error) {
    next(error);
  }
}

export async function update(
  req: UpdateProfessorRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    const professor = await service.update(
      id,
      req.body
    );

    res.json(professor);
  }
  catch (error) {
    next(error);
  }
}

export async function remove(
  req: Request<ProfessorIdParams>,
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