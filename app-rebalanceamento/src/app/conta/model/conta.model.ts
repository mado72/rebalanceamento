import { Moeda } from "src/app/ativos/model/ativos.model";

export enum TipoConta {
    CORRENTE = "CORRENTE",
    INVESTIMENTO = "INVESTIMENTO",
    POUPANCA = "POUPANCA",
    CARTAO = "CARTAO"
}
export interface IConta extends Conta {}

export class Conta {
    _id?: string;
    conta!: string;
    saldo!: number;
    saldoReal?: number;
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