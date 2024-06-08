import { Moeda, TipoAtivo } from "src/app/ativos/model/ativos.model";

export class CotacaoImpl {
    simbolo: string;
    preco: number;
    moeda: Moeda;
    tipo: TipoAtivo;

    constructor(cotacao: ICotacao) {
        this.simbolo = cotacao.simbolo;
        this.preco = cotacao.preco;
        this.moeda = cotacao.moeda;
        this.tipo = cotacao.tipo;
    }
}

export interface ICotacao extends CotacaoImpl {
}
