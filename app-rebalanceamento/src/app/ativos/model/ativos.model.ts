export interface Ativo {
    ativo: string,
    qtd: number,
    vlUnitario: number,
    vlInicial?: number,
    valor: number
}

export interface CarteiraItem {
    ativo: Ativo,
    objetivo: number,
}

export interface Carteira {
    id?: number,
    nome: string,
    items: CarteiraItem[],
}

export class CarteiraImpl implements Carteira {
    id?: number;
    nome: string;
    items: CarteiraItem[];
    
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