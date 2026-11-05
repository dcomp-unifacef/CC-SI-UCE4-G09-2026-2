<<<<<<< HEAD
export interface UpdateModalidadeDto {
    nome?: string,
    turmaId?: number;
}
=======
import type { CreateModalidadeDto } from "./createModalidadeDto";

export type UpdateModalidadeDto = Partial<CreateModalidadeDto>;
>>>>>>> origin/juliaM
