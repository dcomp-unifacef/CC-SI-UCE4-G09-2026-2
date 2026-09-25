import type {
    Request,
    Response,
    NextFunction,
} from "express"

import * as service from "../services/alunoService"

import type { CreateAlunoDto } from "../dto/aluno/createAlunoDto"
import type { UpdateAlunoDto } from "../dto/aluno/updateAlunoDto"

type AlunoIdParams = {
    id: string;
};

type CreateAlunoRequest = Request<
    Record<string, never>,
    unknown,
    CreateAlunoDto
>;

type UpdateAlunoRequest = Request<
    AlunoIdParams,
    unknown,
    UpdateAlunoDto
>;

export async function retrieveAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const alunos = await service.findAll();
        res.json(alunos);
    } catch (error) {
        next(error);
        
    }
}

export async function retrieveOne(
    req: Request<AlunoIdParams>,
    res: Response,
    next: NextFunction
): Promise<void>{
    try {
        const id = Number(req.params.id);

        const aluno = await service.findById(id);

        res.json(aluno);
    } catch (error) {
        next(error);
    }
}

export async function create(
    req: CreateAlunoRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const aluno = await service.create(req.body);

        res.status(201).json(aluno);
    } catch (error) {
        next(error);
    }
}

export async function update(
    req: UpdateAlunoRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        const aluno = await service.update(
            id, 
            req.body
        );
        
        res.json(aluno);
    } catch (error) {
        next(error);
    }
}

export async function remove(
    req: Request<AlunoIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        await service.remove(id);

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}