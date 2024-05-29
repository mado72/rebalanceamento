import { Moeda } from "src/app/ativos/model/ativos.model";

export enum TipoConta {
    CORRENTE = "CORRENTE",
    INVESITMENTO = "INVESITMENTO",
    POUPANCA = "POUPANCA",
    CARTAO = "CARTAO"
}
export interface Conta {
    id?: number,
    nome: string,
    saldo: number,
    tipo: TipoConta,
    moeda: Moeda
}
