import type { Request, Response, NextFunction } from "express"
import * as service from "../services/authService"
import type { CadastroDto } from "../dto/auth/cadastroDto"
import type { LoginDto } from "../dto/auth/loginDto"
import type { EsqueciSenhaDto } from "../dto/auth/esqueciSenhaDto"
import type { RedefinirSenhaDto } from "../dto/auth/redefinirSenhaDto"

type Vazio = Record<string, never>

export async function cadastro(req: Request<Vazio, unknown, CadastroDto>, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await service.cadastro(req.body ?? ({} as CadastroDto)))
  } catch (error) { next(error) }
}

export async function login(req: Request<Vazio, unknown, LoginDto>, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await service.login(req.body ?? ({} as LoginDto)))
  } catch (error) { next(error) }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await service.me(req.auth!.id))
  } catch (error) { next(error) }
}

export async function esqueciSenha(req: Request<Vazio, unknown, EsqueciSenhaDto>, res: Response, next: NextFunction): Promise<void> {
  try {
    const message = await service.esqueciSenha(req.body ?? ({} as EsqueciSenhaDto))
    res.json({ message })
  } catch (error) { next(error) }
}

export async function redefinirSenha(req: Request<Vazio, unknown, RedefinirSenhaDto>, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await service.redefinirSenha(req.body ?? ({} as RedefinirSenhaDto)))
  } catch (error) { next(error) }
}
