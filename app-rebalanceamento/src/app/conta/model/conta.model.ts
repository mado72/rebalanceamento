import { Moeda } from "src/app/ativos/model/ativos.model";

export enum TipoConta {
    CORRENTE = "CORRENTE",
    CARTAO = "CARTAO",
    INVESTIMENTO = "INVESTIMENTO"
}
export interface Conta {
    _id?: string,
    nome: string,
    saldo: number,
    tipo: TipoConta,
    moeda: Moeda
}
