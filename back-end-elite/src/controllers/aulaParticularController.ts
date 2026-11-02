import type {
    Request,
    Response,
    NextFunction,
} from "express";

import * as service from "../services/aulaParticularService";

import type { CreateAulaParticularDto } from "../dto/aulaParticular/createAulaParticularDto";
import type { UpdateAulaParticularDto } from "../dto/aulaParticular/updateAulaParticularDto";

type AulaParticularIdParams = {
    id: string;
};

type CreateAulaParticularRequest = Request<
    Record<string, never>,
    unknown,
    CreateAulaParticularDto
>;

type UpdateAulaParticularRequest = Request<
    AulaParticularIdParams,
    unknown,
    UpdateAulaParticularDto
>;

export async function retrieveAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const aulas = await service.findAll();
        res.json(aulas);
    } catch (error) {
        next(error);
    }
}

export async function retrieveOne(
    req: Request<AulaParticularIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ message: "Id inválido." });
            return;
        }

        const aula = await service.findById(id);
        res.json(aula);
    } catch (error) {
        next(error);
    }
}

export async function create(
    req: CreateAulaParticularRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const aula = await service.create(req.body);
        res.status(201).json(aula);
    } catch (error) {
        next(error);
    }
}

export async function update(
    req: UpdateAulaParticularRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ message: "Id inválido." });
            return;
        }

        const aula = await service.update(id, req.body);
        res.json(aula);
    } catch (error) {
        next(error);
    }
}

export async function remove(
    req: Request<AulaParticularIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ message: "Id inválido." });
            return;
        }

        await service.remove(id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
}
