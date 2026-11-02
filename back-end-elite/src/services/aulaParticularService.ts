
import * as repository from "../repositories/aulaParticularRepository";
import type { aulaParticular } from "../../generated/prisma/client";
import type { CreateAulaParticularDto } from "../dto/aulaParticular/createAulaParticularDto";
import type { UpdateAulaParticularDto } from "../dto/aulaParticular/updateAulaParticularDto";
import { NotFoundError } from "../errors/NotFoundError";

export async function findAll(): Promise<aulaParticular[]> {
    return repository.findAll();
}

export async function findById(id: number): Promise<aulaParticular> {
    const aula = await repository.findById(id);

    if (!aula) {
        throw new NotFoundError("Aula particular não encontrada.");
    }

    return aula;
}

export async function create(
    data: CreateAulaParticularDto
): Promise<aulaParticular> {
    return repository.create(data);
}

export async function update(
    id: number,
    data: UpdateAulaParticularDto
): Promise<aulaParticular> {
    await findById(id);

    return repository.update(id, data);
}

export async function remove(id: number): Promise<aulaParticular> {
    await findById(id);

    return repository.remove(id);
}
