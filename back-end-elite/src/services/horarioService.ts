import * as repository from "../repositories/horarioRepository";
import type { horario } from "../../generated/prisma/client";
import type { CreateHorarioDto } from "../dto/horario/createHorarioDto";
import type { UpdateHorarioDto } from "../dto/horario/updateHorarioDto";
import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<horario[]> {
    return repository.findAll();
}

export async function findById(id: number): Promise<horario> {
    const horario = await repository.findById(id);

    if (!horario) {
        throw new NotFoundError("Horário não encontrado.");
    }

    return horario;
}

export async function create(
    data: CreateHorarioDto
): Promise<horario> {
    return repository.create(data);
}

export async function update(
    id: number,
    data: UpdateHorarioDto
): Promise<horario> {
    await findById(id);

    return repository.update(id, data);
}

export async function remove(id: number): Promise<horario> {
    await findById(id);

    return repository.remove(id);
}
