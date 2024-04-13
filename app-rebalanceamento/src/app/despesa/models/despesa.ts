export interface DespesaProgramada {
    id: number | null;
    nome: string;
    valor: number;
    diaVencimento: number;
    pagamentoAntecipado: boolean;
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
}

export interface EntityDespesa {
    despesaProgramadaId: number;
    mes: Meses;
    ano: number;
    valor: number;
    pago: boolean;
}

export function obterMes(mesStr: string): Meses | undefined {
    return Object.values(Meses).find(item=>item==mesStr);
}
    