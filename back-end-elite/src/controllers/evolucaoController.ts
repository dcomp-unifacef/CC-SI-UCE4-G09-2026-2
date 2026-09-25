import type {
    Request,
    Response,
    NextFunction,
} from "express"

import * as service from "../services/evolucaoService"

import type { CreateEvolucaoDto } from "../dto/evolucao/createEvolucaoDto"
import type { UpdateEvolucaoDto } from "../dto/evolucao/updateEvolucaoDto"

type EvolucaoIdParams = {
    id: string;
};

type CreateEvolucaoRequest = Request<
    Record<string, never>,
    unknown,
    CreateEvolucaoDto
>;

type UpdateEvolucaoRequest = Request<
    EvolucaoIdParams,
    unknown,
    UpdateEvolucaoDto
>;

export async function retrieveAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const evolucoes = await service.findAll();
        res.json(evolucoes);
    } catch (error) {
        next(error);
        
    }
}

export async function retrieveOne(
    req: Request<EvolucaoIdParams>,
    res: Response,
    next: NextFunction
): Promise<void>{
    try {
        const id = Number(req.params.id);

        const evolucao = await service.findById(id);

        res.json(evolucao);
    } catch (error) {
        next(error);
    }
}

export async function create(
    req: CreateEvolucaoRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const evolucao = await service.create(req.body);

        res.status(201).json(evolucao);
    } catch (error) {
        next(error);
    }
}

export async function update(
    req: UpdateEvolucaoRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        const evolucao = await service.update(
            id, 
            req.body
        );
        
        res.json(evolucao);
    } catch (error) {
        next(error);
    }
}

export async function remove(
    req: Request<EvolucaoIdParams>,
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