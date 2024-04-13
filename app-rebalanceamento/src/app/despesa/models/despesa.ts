export interface Despesa {
    id: number | null;
    valor: number;
    diaVencimento: number;
    paga: boolean;
    pagamentoAntecipado: boolean;
}
