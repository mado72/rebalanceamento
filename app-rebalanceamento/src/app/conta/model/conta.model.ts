import { Moeda } from "src/app/ativos/model/ativos.model";

export enum TipoConta {
    CORRENTE = "CORRENTE",
    INVESITMENTO = "INVESITMENTO"
}
export interface Conta {
    id?: number,
    nome: string,
    saldo: number,
    tipo: TipoConta,
    moeda: Moeda
}
