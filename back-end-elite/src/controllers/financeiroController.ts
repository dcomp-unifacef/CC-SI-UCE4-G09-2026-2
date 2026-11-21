import type { Request, Response, NextFunction } from "express"
import * as service from "../services/financeiroService"
import type { CreateFinanceiroDto } from "../dto/financeiro/createFinanceiroDto"
import type { UpdateFinanceiroDto } from "../dto/financeiro/updateFinanceiroDto"

type IdParams = { id: string }
type AlunoParams = { alunoId: string }

function parseId(value: string, res: Response): number | null {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) { res.status(400).json({ message: "Id inválido." }); return null }
  return id
}

export async function retrieveAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.json(await service.findAll()) } catch (e) { next(e) }
}

export async function retrieveByAluno(req: Request<AlunoParams>, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.alunoId, res); if (id === null) return
    res.json(await service.findByAluno(id))
  } catch (e) { next(e) }
}

export async function retrieveOne(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id, res); if (id === null) return
    res.json(await service.findById(id))
  } catch (e) { next(e) }
}

export async function create(
  req: Request<Record<string, never>, unknown, CreateFinanceiroDto>,
  res: Response, next: NextFunction
): Promise<void> {
  try { res.status(201).json(await service.create(req.body)) } catch (e) { next(e) }
}

export async function update(
  req: Request<IdParams, unknown, UpdateFinanceiroDto>,
  res: Response, next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, res); if (id === null) return
    res.json(await service.update(id, req.body))
  } catch (e) { next(e) }
}

export async function pagar(
  req: Request<IdParams, unknown, { forma?: string }>,
  res: Response, next: NextFunction
): Promise<void> {
  try {
    const id = parseId(req.params.id, res); if (id === null) return
    res.json(await service.pagar(id, req.body?.forma))
  } catch (e) { next(e) }
}

export async function remove(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id, res); if (id === null) return
    await service.remove(id)
    res.status(204).end()
  } catch (e) { next(e) }
}
