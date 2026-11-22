import type { Request, Response, NextFunction } from "express"
import * as service from "../services/alunoMeService"

export async function obterPerfil(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const aluno = await service.obterPerfil(req.aluno!.id)
    res.json(aluno)
  } catch (error) {
    next(error)
  }
}

export async function atualizarPerfil(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const aluno = await service.atualizarPerfil(req.aluno!.id, req.body ?? {})
    res.json(aluno)
  } catch (error) {
    next(error)
  }
}

export async function obterFrequencia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const presencas = await service.obterFrequencia(req.aluno!.id)
    res.json(presencas)
  } catch (error) {
    next(error)
  }
}

export async function obterAulas(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const aulas = await service.obterAulas(req.aluno!.id)
    res.json(aulas)
  } catch (error) {
    next(error)
  }
}

export async function obterFinanceiro(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const financeiro = await service.obterFinanceiro(req.aluno!.id)
    res.json(financeiro)
  } catch (error) {
    next(error)
  }
}

export async function obterEvolucoes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const evolucoes = await service.obterEvolucoes(req.aluno!.id)
    res.json(evolucoes)
  } catch (error) {
    next(error)
  }
}

export async function criarEvolucao(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const evolucao = await service.criarEvolucao(req.aluno!.id, req.body)
    res.status(201).json(evolucao)
  } catch (error) {
    next(error)
  }
}

export async function obterCampeonatos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const inscricoes = await service.obterCampeonatos(req.aluno!.id)
    res.json(inscricoes)
  } catch (error) {
    next(error)
  }
}
