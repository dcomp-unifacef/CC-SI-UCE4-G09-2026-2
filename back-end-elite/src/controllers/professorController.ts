import type { Request, Response, NextFunction } from "express"
import * as service from "../services/professorService"
import type { CreateProfessorDto } from "../dto/professor/createProfessorDto"
import type { UpdateProfessorDto } from "../dto/professor/updateProfessorDto"

type IdParams = { id: string }

export async function retrieveAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await service.findAll())
  } catch (error) { next(error) }
}

export async function retrieveAllAtivos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await service.findAllAtivos())
  } catch (error) { next(error) }
}

export async function retrieveOne(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) { res.status(400).json({ message: "Id inválido." }); return }
    res.json(await service.findById(id))
  } catch (error) { next(error) }
}

export async function create(
  req: Request<Record<string, never>, unknown, CreateProfessorDto>,
  res: Response, next: NextFunction
): Promise<void> {
  try {
    res.status(201).json(await service.create(req.body))
  } catch (error) { next(error) }
}

export async function update(
  req: Request<IdParams, unknown, UpdateProfessorDto>,
  res: Response, next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) { res.status(400).json({ message: "Id inválido." }); return }
    res.json(await service.update(id, req.body))
  } catch (error) { next(error) }
}

export async function remove(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) { res.status(400).json({ message: "Id inválido." }); return }
    await service.remove(id)
    res.status(204).end()
  } catch (error) { next(error) }
}

export async function inativar(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) { res.status(400).json({ message: "Id inválido." }); return }
    res.json(await service.inativar(id))
  } catch (error) { next(error) }
}

export async function reativar(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) { res.status(400).json({ message: "Id inválido." }); return }
    res.json(await service.reativar(id))
  } catch (error) { next(error) }
}
