import { Moeda } from "src/app/ativos/model/ativos.model";

export enum TipoConta {
    CORRENTE = "CORRENTE",
    CARTAO = "CARTAO",
    INVESTIMENTO = "INVESTIMENTO"
}
export interface IConta {
    _id?: string,
    conta: string,
    saldo: number,
    tipo: TipoConta,
    moeda: Moeda
}

export class Conta implements IConta {
    _id?: string;
    conta!: string;
    saldo!: number;
    tipo!: TipoConta;
    moeda!: Moeda;
    constructor(valor: IConta) {
        this._id = valor._id;
        this.conta = valor.conta;
        this.saldo = valor.saldo;
        this.tipo = valor.tipo;
        this.moeda = valor.moeda;
    }
    
}