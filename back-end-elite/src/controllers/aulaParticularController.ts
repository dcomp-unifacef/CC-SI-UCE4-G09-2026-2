import type {
    Request,
    Response,
    NextFunction,
} from "express";

import * as service from "../services/aulaParticularService";

import type { CreateAulaParticularDto } from "../dto/aulaParticular/createAulaParticularDto";
import type { UpdateAulaParticularDto } from "../dto/aulaParticular/updateAulaParticularDto";
import type { RegistrarPresencaDto } from "../dto/aulaParticular/registrarPresencaDto";
import type { AgendarRecorrenteDto } from "../dto/aulaParticular/agendarRecorrenteDto";


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


export async function agendar(
    req: CreateAulaParticularRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const aula = await service.agendar(req.body);
        res.status(201).json(aula);
    } catch (error) {
        next(error);
    }
}

export async function cancelar(
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

        const aula = await service.cancelar(id);
        res.json(aula);
    } catch (error) {
        next(error);
    }
}

export async function registrar(
    req: Request<
        AulaParticularIdParams,
        unknown,
        RegistrarPresencaDto
    >,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ message: "Id inválido." });
            return;
        }

        if (typeof req.body?.presenca !== "boolean") {
            res.status(400).json({
                message: "A presença deve ser true ou false."
            });
            return;
        }

        const aula = await service.registrar(
            id,
            req.body.presenca
        );

        res.json(aula);
    } catch (error) {
        next(error);
    }
}


export async function agendarRecorrente(
    req: Request<Record<string, never>, unknown, AgendarRecorrenteDto>,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const recorrencia = await service.agendarRecorrente(req.body);

        res.status(201).json(recorrencia);
    } catch (error) {
        next(error);
    }
}

export async function retrieveRecorrencia(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                message: "ID da recorrência inválido."
            });
            return;
        }

        const recorrencia = await service.findRecorrenciaById(id);

        res.status(200).json(recorrencia);
    } catch (error) {
        next(error);
    }
}

export async function cancelarRecorrencia(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                message: "ID da recorrência inválido."
            });
            return;
        }

        const resultado = await service.cancelarRecorrencia(id);

        res.status(200).json({
            message: "Aulas futuras canceladas.",
            quantidadeCancelada: resultado.count
        });
    } catch (error) {
        next(error);
    }
}
