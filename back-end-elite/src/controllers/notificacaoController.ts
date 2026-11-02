import type {
 Request,
 Response,
 NextFunction,
} from "express";


import * as service from "../services/notificacaoService";


import type { CreateNotificacaoDto } from "../dto/notificacao/createNotificacaoDto";
import type { UpdateNotificacaoDto } from "../dto/notificacao/updateNotificacaoDto";



type NotificacaoIdParams = {
 id: string;
};


type CreateNotificacaoRequest = Request<
 Record<string, never>,
 unknown,
 CreateNotificacaoDto
>;


type UpdateNotificacaoRequest = Request<
 NotificacaoIdParams,
 unknown,
 UpdateNotificacaoDto
>;


export async function retrieveAll(
 req: Request,
 res: Response,
 next: NextFunction
): Promise<void> {
 try {
   const notificacoes = await service.findAll();


   res.json(notificacoes);
 }
 catch (error) {
   next(error);
 }
}


export async function retrieveOne(
 req: Request<NotificacaoIdParams>,
 res: Response,
 next: NextFunction
): Promise<void> {
 try {
   const id = Number(req.params.id);


   const notificacao = await service.findById(id);


   res.json(notificacao);
 }
 catch (error) {
   next(error);
 }
}


export async function create(
 req: CreateNotificacaoRequest,
 res: Response,
 next: NextFunction
): Promise<void> {
 try {
   const notificacao = await service.create(req.body);


   res.status(201).json(notificacao);
 }
 catch (error) {
   next(error);
 }
}


export async function update(
 req: UpdateNotificacaoRequest,
 res: Response,
 next: NextFunction
): Promise<void> {
 try {
   const id = Number(req.params.id);


   const notificacao = await service.update(
     id,
     req.body
   );


   res.json(notificacao);
 }
 catch (error) {
   next(error);
 }
}


export async function remove(
 req: Request<NotificacaoIdParams>,
 res: Response,
 next: NextFunction
): Promise<void> {
 try {
   const id = Number(req.params.id);


   await service.remove(id);


   res.status(204).end();
 }
 catch (error) {
   next(error);
 }
}
