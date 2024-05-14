import { getTime } from "date-fns";
import { DateTime } from "luxon";
import { Conta } from "src/app/conta/model/conta.model";
import { Periodicidade } from "src/app/transacao/models/transacao.model";

export interface IRecebimento {
    _id?: string; // Identificador único do recebimento (quando persistida)
    descricao: string; // Descrição do recebimento
    valor: number; // Valor do recebimento
    periodicidade: Periodicidade; // Periodicidade do recebimento (mensal, trimestral, anual, etc.)
    dataInicial: Date; // Data de vencimento do recebimento
    dataRecebimento?: Date; // Data de vencimento do recebimento
    dataFinal?: Date // Data final da recorrência (opcional)
    contaLiquidacao?: Conta // Conta de Liquidação
    origem?: string; // Origem do recebimento
}
export class RecebimentoImpl implements IRecebimento {
    _id?: string;
    descricao!: string;
    valor!: number;
    periodicidade!: Periodicidade;
    dataInicial!: Date;
    dataRecebimento?: Date | undefined;
    dataPagamento?: Date | undefined;
    dataFinal?: Date | undefined;
    contaLiquidacao?: Conta | undefined;
    origem?: string;

    constructor(valorInicial: Partial<IRecebimento>) {
        this._id = valorInicial._id;
        this.descricao = valorInicial.descricao || '';
        this.valor = valorInicial.valor || 0;
        this.periodicidade = valorInicial.periodicidade || Periodicidade.MENSAL;
        this.dataInicial = valorInicial.dataInicial ? this.toDate(valorInicial.dataInicial) : new Date();
        this.dataRecebimento = valorInicial.dataRecebimento ? this.toDate(valorInicial.dataRecebimento) : new Date();
        this.dataFinal = valorInicial.dataFinal ? this.toDate(valorInicial.dataFinal) : undefined;
        this.contaLiquidacao = valorInicial.contaLiquidacao;
        this.origem = valorInicial.origem;
    }

    private toDate(d: any) {
        if (!d) return undefined;
        if (!!d && typeof d.getMonth === 'function') {
            return d;
        }
        return DateTime.fromISO(d).toJSDate();
    }

    public programacaoDatas(ateData: Date) {
        const datas = new Array<Date>();
        let dataFinalPeriodo = DateTime.fromJSDate(ateData).endOf("day");
        if (!!this.dataFinal && dataFinalPeriodo > DateTime.fromJSDate(this.dataFinal)) {
            dataFinalPeriodo = DateTime.fromJSDate(this.dataFinal).endOf("day");
        }

        let data = DateTime.fromJSDate(this.dataInicial).startOf("day");

        while (data < dataFinalPeriodo) {
            datas.push(data.toJSDate());
            switch (this.periodicidade) {
                case Periodicidade.UNICO:
                    return datas;
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

    public programacaoInstancias(ateData: Date) {
        const datas = this.programacaoDatas(ateData);
        const despesas = datas.filter(data => getTime(data) != getTime(this.dataInicial)).map(data => {
            let d = new RecebimentoImpl(this);
            d.dataInicial = data;
            d._id = undefined;
            d.dataPagamento = undefined;
            d.origem = this._id;
            return d;
        });
        despesas.push(this);
        despesas.sort((a, b) => a.dataInicial.getTime() - b.dataInicial.getTime());
        return despesas;
    }
}
