export enum TipoAtivo {
    REFERENCIA = "REFERENCIA",
    ACAO = "ACAO",
    FII = "FII",
    RF = "RF",
    FUNDO = "FUNDO",
    CRIPTO = "CRIPTO",
    CASHBACK = "CASHBACK"
}

export enum Moeda {
    REAL = "REAL",
    DOLAR = "DOLAR",
    USDT = "USDT"
}

export const MoedaSigla = {
    REAL: "R$",
    DOLAR: "$",
    USDT: "USDT"
}

export enum TipoObjetoReferenciado {
    DESPESA = "DESPESA",
    PAGAMENTO = "PAGAMENTO",
    CONTA = "CONTA",
    CARTEIRA = "CARTEIRA",
}

export interface ObjetoReferenciado {
    id?: any,
    tipoRef: TipoObjetoReferenciado
}

export interface Ativo {
    sigla: string,
    tipoAtivo?: TipoAtivo,
    moeda?: Moeda,
}

export class AtivoImpl implements Ativo {
    sigla: string;
    tipoAtivo?: TipoAtivo | undefined;
    moeda?: Moeda | undefined;
    
    constructor(sigla: string, tipoAtivo?: TipoAtivo | undefined, moeda?: Moeda | undefined) {
        this.sigla = sigla;
        this.tipoAtivo = tipoAtivo;
        this.moeda = moeda;
    }
}

export interface ICarteiraAtivo {
    qtd: number,
    ativo: Ativo,
    vlUnitario: number,
    vlInicial?: number,
    valor: number,
    referencia?: {
        tipo: TipoObjetoReferenciado,
        id: number
    }
    objetivo: number,
}

export interface ICarteira extends ObjetoReferenciado {
    nome: string,
    items: ICarteiraAtivo[],
}

export class CarteiraImpl implements ICarteira {
    id?: number;
    nome: string;
    items: ICarteiraAtivo[];
    objetivo: number;
    readonly tipoRef = TipoObjetoReferenciado.CARTEIRA;
    tipoAtivo?: TipoAtivo;
    moeda?: Moeda;
    
    constructor(nome: string, objetivo?: number, id?: number, items?: ICarteiraAtivo[]) {
        this.nome = nome;
        this.id = id;
        this.objetivo = objetivo || 0;
        this.items = items || [];
    }

    get total(): number {
        return this.items.map(item => item.valor).reduce((a, b) => a + b, 0);
    }
    percAtivo(item: ICarteiraAtivo): number {
        return item.valor / this.total;
    }
    diferenca(item: ICarteiraAtivo): number {
        return this.percAtivo(item) - item.objetivo;
    }
}