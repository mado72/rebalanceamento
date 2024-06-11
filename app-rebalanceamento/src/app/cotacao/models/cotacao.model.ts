import { Moeda, TipoAtivo } from "src/app/ativos/model/ativos.model";

export class CotacaoImpl {
    simbolo: string;
    preco: number;
    moeda: Moeda;
    data: Date;

    constructor(cotacao: ICotacao) {
        this.simbolo = cotacao.simbolo;
        this.preco = cotacao.preco;
        this.moeda = cotacao.moeda;
        this.data = cotacao.data;
    }
}

export interface ICotacao extends CotacaoImpl {
}
