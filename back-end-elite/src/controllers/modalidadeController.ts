import type {
 Request,
 Response,
 NextFunction,
} from "express";

import * as service from "../services/modalidadeService"
import type { CreateModalidadeDto } from "../dto/modalidade/createModalidadeDto"
import type { UpdateModalidadeDto } from "../dto/modalidade/updateModalidadeDto"


type ModalidadeIdParams = { 
    id: string;
};

type CreateModalidadeRequest = Request<
    Record<string, never>,
    unknown,
    CreateModalidadeDto
>;

type UpdateModalidadeRequest = Request<
    ModalidadeIdParams,
    unknown,
    UpdateModalidadeDto
>;

export async function retrieveAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const modalidades = await service.findAll();
        res.json(modalidades);
    } catch (error) {
        next(error);
        
    }
}

export async function retrieveOne(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);
        const modalidade = await service.findById(id);
        res.json(modalidade);
    } catch (error) {
        next(error);
    }
}

export async function create(
    req: CreateModalidadeRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const modalidade = await service.create(req.body);
        res.status(201).json(modalidade);
    } catch (error) {
        next(error);
    }
}

export async function update(
    req: UpdateModalidadeRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        const modalidade = await service.update(
            id,
            req.body
        );
        res.json(modalidade);
    } catch (error) {
        next(error);
    }
}

export async function remove(
    req: Request<ModalidadeIdParams>,
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