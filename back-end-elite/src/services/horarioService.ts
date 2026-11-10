import * as repository from "../repositories/horarioRepository";
import type { Horario } from "../../generated/prisma/client";
import type { CreateHorarioDto } from "../dto/horario/createHorarioDto";
import type { UpdateHorarioDto } from "../dto/horario/updateHorarioDto";
import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<Horario[]> {
    return repository.findAll();
}

export async function findById(id: number): Promise<Horario> {
    const horario = await repository.findById(id);

    if (!horario) {
        throw new NotFoundError("Horário não encontrado.");
    }

    return horario;
}

export async function create(
    data: CreateHorarioDto
): Promise<Horario> {
    return repository.create(data);
}

export async function update(
    id: number,
    data: UpdateHorarioDto
): Promise<Horario> {
    await findById(id);

    return repository.update(id, data);
}

export async function remove(id: number): Promise<Horario> {
    await findById(id);

    return repository.remove(id);
}
