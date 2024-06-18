import { Observable, Subscriber } from "rxjs";
import { ICotacao } from "src/app/cotacao/models/cotacao.model";

export enum TipoAtivo {
    REFERENCIA = "REFERENCIA",
    MOEDA = "MOEDA",
    ACAO = "ACAO",
    FII = "FII",
    RF = "RF",
    FUNDO = "FUNDO",
    CRIPTO = "CRIPTO",
    CASHBACK = "CASHBACK"
}

export enum Moeda {
    BRL = "BRL",
    USD = "USD",
    USDT = "USDT"
}

export const MoedaSigla = {
    BRL: "R$",
    USD: "$",
    USDT: "USDT"
}

export enum TipoObjetoReferenciado {
    DESPESA = "DESPESA",
    PAGAMENTO = "PAGAMENTO",
    CONTA = "CONTA",
    CARTEIRA = "CARTEIRA",
}

export interface ObjetoReferenciado {
    _id?: any,
    tipoRef: TipoObjetoReferenciado
}

export interface IAtivo extends AtivoImpl {
}

export class AtivoImpl {
    _id?: string;
    nome: string;
    sigla: string;
    siglaYahoo?: string;
    tipoAtivo?: TipoAtivo | undefined;
    moeda: Moeda;
    setor?: string;
    cotacao?: ICotacao;
    referencia?: {
        tipo: TipoObjetoReferenciado,
        id: string
    }

    constructor(ativo: IAtivo) {
        this._id = ativo._id;
        this.nome = ativo.nome;
        this.sigla = ativo.sigla;
        this.siglaYahoo = ativo.siglaYahoo;
        this.moeda = ativo.moeda || Moeda.BRL;
        this.tipoAtivo = ativo.tipoAtivo;
        this.cotacao = ativo.cotacao;
        this.setor = ativo.setor;
        this.referencia = ativo.referencia;
    }
}

export interface ICarteiraAtivo {
    ativoId?: string,
    quantidade: number,
    objetivo: number,
    vlInicial?: number,
    vlAtual?: number,
    vlMoeda?: number,
    ativo: IAtivo,
    referencia?: {
        tipo: TipoObjetoReferenciado,
        id: number
    }
}

export type ICarteira = Omit<CarteiraImpl, "percAtivo" | "diferenca" | "calculaTotais">;

export interface TotalCarteira {
    moeda: Moeda;
    resultado: number;
    objetivo: number;
    vlInicial: number;
    vlAtual: number | undefined;
    vlMoeda?: number;
}

export class CarteiraImpl implements ObjetoReferenciado {
    _id?: string;
    nome: string;
    private _items: ICarteiraAtivo[] = [];
    objetivo: number;
    readonly tipoRef = TipoObjetoReferenciado.CARTEIRA;
    classe: TipoAtivo;
    moeda: Moeda;
    private _total!: TotalCarteira;
    
    constructor(carteira: Partial<ICarteira>) {
        this._id = carteira._id;
        this.nome = carteira.nome || 'Nova Carteira';
        this.objetivo = carteira.objetivo || 0;
        this.classe = carteira.classe || TipoAtivo.ACAO;
        this.moeda = carteira.moeda || Moeda.BRL;
        this._items = carteira.items || [];
    }

    get items() {
        return this._items;
    }

    set items(items: ICarteiraAtivo[]) {
        this._items = Object.assign([], items);
        this.calculaTotais();
    }

    get total(): TotalCarteira {
        return this._total;
    }

    percAtivo(item: ICarteiraAtivo): number {
        if (this.total.vlAtual)
            return (item.vlAtual || item.vlInicial || 0) / this.total.vlAtual;
        return 0;
    }

    diferenca(item: ICarteiraAtivo): number | undefined {
        return item.objetivo && ((this.percAtivo(item) - item.objetivo) / item.objetivo);
    }

    calculaTotais(cotacaoMoeda?: {moeda: Moeda; valor: number}) {
        const totais = (this.items || [])
            .map(item => {
                item.vlMoeda = item.vlMoeda || item.vlAtual;
                return {
                    moeda: this.moeda,
                    resultado: item.vlAtual || 0 - (item.vlInicial || 0),
                    objetivo: item.objetivo,
                    vlInicial: item.vlInicial || 0,
                    vlAtual: item.vlAtual || 0,
                    vlMoeda: item.vlMoeda || item.vlAtual || 0,
                };
            });
        const totalInicial = {
            moeda: this.moeda,
            resultado: 0,
            objetivo: 0,
            vlInicial: 0,
            vlAtual: 0
        };
        if (!totais.length) {
            this._total = totalInicial;
            return;
        }
        this._total = totais.reduce((acc, item) => {
            return {
                moeda: acc.moeda,
                resultado: acc.resultado + item.resultado,
                objetivo: acc.objetivo + item.objetivo,
                vlInicial: acc.vlInicial + item.vlInicial || 0,
                vlAtual: acc.vlAtual + item.vlAtual || 0,
                vlMoeda: (acc.vlMoeda || 0) + (item.vlMoeda || 0)
            }
        })

    }
}