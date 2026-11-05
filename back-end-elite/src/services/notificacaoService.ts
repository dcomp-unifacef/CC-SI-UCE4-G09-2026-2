import * as repository from "../repositories/notificacaoRepository";


import type { Notificacao} from "../../generated/prisma/client";
import type { CreateNotificacaoDto } from "../dto/notificacao/createNotificacaoDto";
import type { UpdateNotificacaoDto } from "../dto/notificacao/updateNotificacaoDto";


import { NotFoundError } from "../errors/NotFoundError";


export async function findAll(): Promise<Notificacao[]> {
 return repository.findAll();
}


export async function findById(
 id: number
): Promise<Notificacao> {
 const notificacao = await repository.findById(id);


 if (!notificacao) {
   throw new NotFoundError("Notificação não encontrada.");
 }


 return notificacao;
}


export async function create(
 data: CreateNotificacaoDto
): Promise<Notificacao> {
 return repository.create(data);
}


export async function update(
 id: number,
 data: UpdateNotificacaoDto
): Promise<Notificacao> {
 await findById(id);


 return repository.update(id, data);
}


export async function remove(
 id: number
): Promise<Notificacao> {
 await findById(id);


 return repository.remove(id);
}
