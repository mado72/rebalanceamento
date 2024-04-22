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

export const MoedaSigla= {
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
    qtd: number,
    vlUnitario: number,
    vlInicial?: number,
    valor: number,
    tipoAtivo?: TipoAtivo,
    moeda?: Moeda,
    referencia?: {
        tipo: TipoObjetoReferenciado,
        id: number
    }
}

export interface CarteiraItem {
    ativo: Ativo,
    objetivo: number,
}

export interface Carteira extends ObjetoReferenciado {
    nome: string,
    items: CarteiraItem[],
}

export class AtivoImpl implements Ativo {
    tipoAtivo?: TipoAtivo | undefined;
    id?: any;
    sigla!: string;
    qtd!: number;
    vlUnitario!: number;
    vlInicial?: number | undefined;
    valor!: number;
    tipo?: TipoAtivo | undefined;
    moeda?: Moeda | undefined;
    referencia?: { tipo: TipoObjetoReferenciado; id: number; } | undefined;
}

export class CarteiraImpl implements Carteira {
    id?: number;
    nome: string;
    items: CarteiraItem[];
    readonly tipoRef = TipoObjetoReferenciado.CARTEIRA;
    
    constructor(nome: string, id?: number, items?: CarteiraItem[]) {
        this.nome = nome;
        this.id = id;
        this.items = items || [];
    }

    get total(): number {
        return this.items.map(item => item.ativo.valor).reduce((a, b) => a + b, 0);
    }
    percAtivo(item: CarteiraItem): number {
        return item.ativo.valor / this.total;
    }
    diferenca(item: CarteiraItem): number {
        return this.percAtivo(item) - item.objetivo;
    }
}