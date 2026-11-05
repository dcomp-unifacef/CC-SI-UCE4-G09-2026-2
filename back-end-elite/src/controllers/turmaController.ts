import type {
    Request,
    Response,
    NextFunction,
} from "express"

import * as service from "../services/turmaService"

import type { CreateTurmaDto } from "../dto/turma/createTurmaDto"
import type { UpdateTurmaDto } from "../dto/turma/updateTurmaDto"


type TurmaIdParams = {
    id: string;
};

type CreateTurmaRequest = Request<
    Record<string, never>,
    unknown,
    CreateTurmaDto
>;

type UpdateTurmaRequest = Request<
    TurmaIdParams,
    unknown,
    UpdateTurmaDto
>;

export async function retrieveAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const turmas = await service.findAll();

        res.json(turmas);
    }
    catch(error){
        next(error);
    }
}

export async function retrieveOne(
    req: Request<TurmaIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        const turma = await service.findById(id);

        res.json(turma);
    }
    catch(error){
        next(error);
    }
}

export async function create(
    req: CreateTurmaRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const turma = await service.create(req.body);

        res.status(201).json(turma);
    }
    catch(error){
        next(error);
    }
}

export async function update(
    req: UpdateTurmaRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);
        const turma = await service.update(
            id,
            req.body
        );
    res.json(turma);
    }
    catch(error){
        next(error);
    }
}

export async function remove(
    req: Request<TurmaIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        await service.remove(id);

        res.status(204).end;

    }
    catch(error) {
        next(error);
    }
}