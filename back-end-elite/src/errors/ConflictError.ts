import { AppError } from './AppError'

export class ConflictError extends AppError {
    constructor(message = 'Conflito na operação.') {
        super(message, 409)
        this.name = 'ConflictError'
    }
}