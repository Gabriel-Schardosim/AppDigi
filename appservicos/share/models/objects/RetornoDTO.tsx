export class RetornoDTO {
    idGravado: number;
    idComErro: number;
    idExcluido: number;
    message: string;
    error: boolean;
    status: number;
    timestamp: Date;

    constructor() {
        this.error = false;
        return this;
    }

    construtorComErro(message: string): RetornoDTO {
        this.message = message;
        this.error = true;
        return this;
    }
}

