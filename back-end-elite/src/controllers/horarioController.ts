import type {
    Request,
    Response,
    NextFunction,
} from "express";

import * as service from "../services/horarioService";

import type { CreateHorarioDto } from "../dto/horario/createHorarioDto";
import type { UpdateHorarioDto } from "../dto/horario/updateHorarioDto";

type HorarioIdParams = {
    id: string;
};

type CreateHorarioRequest = Request<
    Record<string, never>,
    unknown,
    CreateHorarioDto
>;

type UpdateHorarioRequest = Request<
    HorarioIdParams,
    unknown,
    UpdateHorarioDto
>;

export async function retrieveAll(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const horarios = await service.findAll();
        res.json(horarios);
    } catch (error) {
        next(error);
    }
}

export async function retrieveOne(
    req: Request<HorarioIdParams>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ message: "Id inválido." });
            return;
        }

        const horario = await service.findById(id);
        res.json(horario);
    } catch (error) {
        next(error);
    }
}

export async function create(
    req: CreateHorarioRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const horario = await service.create(req.body);
        res.status(201).json(horario);
    } catch (error) {
        next(error);
    }
}

export async function update(
    req: UpdateHorarioRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ message: "Id inválido." });
            return;
        }

        const horario = await service.update(id, req.body);
        res.json(horario);
    } catch (error) {
        next(error);
    }
}

export async function remove(
    req: Request<HorarioIdParams>,
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
