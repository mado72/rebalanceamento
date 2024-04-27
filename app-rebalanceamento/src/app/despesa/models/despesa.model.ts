import { DateTime } from "luxon";
import { Conta } from "src/app/conta/model/conta.model";

export interface IDespesaRecorrente {
    id?: string; // Identificador único da despesa (quando persistida)
    descricao: string; // Descrição da despesa
    valor: number; // Valor da despesa
    periodicidade: Periodicidade; // Periodicidade da despesa (mensal, trimestral, anual, etc.)
    dataVencimento: Date; // Data de vencimento da despesa
    dataFinal?: Date // Data final da recorrência (opcional)
    dataPagamento?: Date; // Data em que a despesa foi paga (opcional)
    origem?: string; // Identifica se a despesa surgiu de uma despesa anterior (opcional)
    categoria?: string; // Identifica a categoria da despesa (opcional)
    liquidacao: TipoLiquidacao; // Tipo de liquidação
    contaLiquidacao?: Conta // Conta de Liquidação
}

export enum Periodicidade {
    SEMANAL = "SEMANAL",
    QUINZENAL = "QUINZENAL",
    MENSAL = "MENSAL",
    TRIMESTRAL = "TRIMESTRAL",
    SEMESTRAL = "SEMESTRAL",
    ANUAL = "ANUAL"
}

export enum Mes {
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

export enum TipoLiquidacao {
    CONTA = 'CONTA',
    CARTAO = 'CARTAO'
}

export function obterMes(mesStr: string): Mes | undefined {
    return Object.values(Mes).find(item => item == mesStr);
}

export class DespesaRecorrenteImpl implements IDespesaRecorrente {
    id?: string;
    descricao!: string;
    valor!: number;
    periodicidade!: Periodicidade;
    dataVencimento!: Date;
    dataPagamento?: Date | undefined;
    dataFinal?: Date | undefined;
    origem?: string | undefined;
    categoria?: string | undefined;
    liquidacao!: TipoLiquidacao;
    contaLiquidacao?: Conta | undefined;

    constructor(valorInicial: IDespesaRecorrente) {
        this.id = valorInicial.id;
        this.descricao = valorInicial.descricao;
        this.valor = valorInicial.valor;
        this.periodicidade = valorInicial.periodicidade;
        this.dataVencimento = valorInicial.dataVencimento;
        this.dataPagamento = valorInicial.dataPagamento;
        this.dataFinal = valorInicial.dataFinal;
        this.origem = valorInicial.origem;
        this.categoria = valorInicial.categoria;
        this.liquidacao = valorInicial.liquidacao;
        this.contaLiquidacao = valorInicial.contaLiquidacao;
    }

    get diaVencimento(): number {
        return this.dataVencimento.getDate();
    }

    get mesVencimento(): Mes | undefined{
        const mesVencimento = DateTime.fromJSDate(this.dataVencimento).month;
        return Object.values(Mes)[mesVencimento-1];
    }

    public programacaoDatas(ateData: Date) {
        const datas = new Array<Date>();
        let dataFinalPeriodo = DateTime.fromJSDate(ateData).endOf("day");
        if (!!this.dataFinal && dataFinalPeriodo > DateTime.fromJSDate(this.dataFinal)) {
            dataFinalPeriodo = DateTime.fromJSDate(this.dataFinal).endOf("day");
        }

        let data = DateTime.fromJSDate(this.dataVencimento).startOf("day");

        while (data < dataFinalPeriodo) {
            datas.push(data.toJSDate());
            switch (this.periodicidade) {
                case Periodicidade.SEMANAL:
                    data = data.plus({ weeks: 1 });
                    break;
                case Periodicidade.QUINZENAL:
                    data = data.plus({ weeks: 2 });
                    break;
                case Periodicidade.MENSAL:
                    data = data.plus({ months: 1 });
                    break;
                case Periodicidade.TRIMESTRAL:
                    data = data.plus({ months: 3 });
                    break;
                case Periodicidade.ANUAL:
                    data = data.plus({ years: 1 });
                    break;
            }
        }

        return datas;
    }

    public programacaoDespesas(ateData: Date) {
        const datas = this.programacaoDatas(ateData);
        const despesas = datas.filter(data=>data != this.dataVencimento).map(data => {
            let d = new DespesaRecorrenteImpl(this);
            d.dataVencimento = data;
            d.id = undefined;
            d.dataPagamento = undefined;
            d.origem = this.id;
            return d;
        });
        despesas.push(this);
        despesas.sort((a,b)=>a.dataVencimento.getTime()-b.dataVencimento.getTime());
        return despesas;
    }
}