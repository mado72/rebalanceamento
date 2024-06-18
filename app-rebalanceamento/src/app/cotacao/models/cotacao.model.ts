import { Moeda, TipoAtivo } from "src/app/ativos/model/ativos.model";

export class CotacaoImpl {
    simbolo: string;
    preco: number;
    precoBRL?: number;
    moeda: Moeda;
    data: Date;

    constructor(cotacao: ICotacao) {
        this.simbolo = cotacao.simbolo;
        this.preco = cotacao.preco;
        this.moeda = cotacao.moeda;
        this.data = cotacao.data;
    }

    atualizarCotacaoMoeda(cotacaoMoeda: number) {
        this.precoBRL = this.preco * cotacaoMoeda;
    }
}

export type ICotacao = Omit<CotacaoImpl, "atualizarCotacaoMoeda">;