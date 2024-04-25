export interface DespesaProgramada {
    id: number | null;
    nome: string;
    valor: number;
    diaVencimento: number;
}

export enum Meses {
    JANEIRO = 'JANEIRO',
    FEVEREIRO = 'FEVEREIRO',
    MARCO = 'MARCO',
    ABRIL = 'ABRIL',
    MAIO = 'MAIO',
    JUNHO = 'JUNHO',
    JULHO = 'JULHO',
    AGOSTO = 'AGOSTO',
    SETEMBRO = 'SETEMBRO',
    OUTUBRO = 'OUTUBRO',
    NOVEMBRO = 'NOVEMBRO',
    DEZEMBRO = 'DEZEMBRO'
}

export type Mes = keyof Meses;

export type TMes = [m: Mes];

export interface Pagamento {
    id: number | null;
    despesaProgramadaId: number;
    valor: number;
    dataPagamento: Date | null;
    pago: boolean;
}

export class PagamentoProgramado implements Pagamento {

    id: number | null = null;
    valor!: number;
    despesa!: DespesaProgramada;
    dataPagamento: Date | null = null;
    pago: boolean = false;
    
    get despesaProgramadaId(): number {
        return this.despesa.id || 0;
    }

    get pagamentoAntecipado(): boolean {
        return this.despesa != null && this.despesa.diaVencimento < 20; 
    }

    get diaVencimento() {
        return this.despesa.diaVencimento
    }

    // get pago(): boolean {
    //     return this.dataPagamento != null;
    // }
}

export interface EntityDespesa {
    despesaProgramadaId: number;
    mes: Meses;
    ano?: number;
    valor: number;
    pago: boolean;
}

export function obterMes(mesStr: string): Meses | undefined {
    return Object.values(Meses).find(item=>item==mesStr);
}
    