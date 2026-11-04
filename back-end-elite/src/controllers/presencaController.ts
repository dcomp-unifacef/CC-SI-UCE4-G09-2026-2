import type { Request, Response, NextFunction } from "express";
import * as service from "../services/presencaService";
import type { CreatePresencaDto } from "../dto/presenca/createPresencaDto";
import type { UpdatePresencaDto } from "../dto/presenca/updatePresencaDto";

type IdParams = { id: string };

function parseId(value: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new Error("Id inválido.");
  return id;
}

export async function retrieveAll(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await service.findAll()); } catch (error) { next(error); }
}

export async function retrieveOne(req: Request<IdParams>, res: Response, next: NextFunction) {
  try { res.json(await service.findById(parseId(req.params.id))); } catch (error) { next(error); }
}

export async function create(req: Request<Record<string, never>, unknown, CreatePresencaDto>, res: Response, next: NextFunction) {
  try { res.status(201).json(await service.create(req.body)); } catch (error) { next(error); }
}

export async function update(req: Request<IdParams, unknown, UpdatePresencaDto>, res: Response, next: NextFunction) {
  try { res.json(await service.update(parseId(req.params.id), req.body)); } catch (error) { next(error); }
}

export async function remove(req: Request<IdParams>, res: Response, next: NextFunction) {
  try {
    await service.remove(parseId(req.params.id));
    res.status(204).end();
  } catch (error) { next(error); }
}
