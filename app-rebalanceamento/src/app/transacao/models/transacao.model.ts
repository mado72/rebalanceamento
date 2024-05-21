import { DateTime } from "luxon";
import { Conta } from "../../conta/model/conta.model";
import { addDays, addMonths, addYears, format, getMonth, getTime, isAfter, isBefore, isSameDay, parse, startOfDay } from "date-fns";

export enum Periodicidade {
    UNICO = "UNICO",
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

export enum TipoTransacao {
    DEBITO = 'DEBITO',
    CREDITO = 'CREDITO'
}

export interface ITransacao {
    _id?: string; // Identificador único da transação (quando persistida)
    descricao: string; // Descrição da transação
    valor: number; // Valor da transação
    tipoTransacao: TipoTransacao; // Tipo de transação
    periodicidade: Periodicidade; // Periodicidade da transação (mensal, trimestral, anual, etc.)
    dataInicial: Date; // Data de vencimento da transação
    dataLiquidacao?: Date; // Data de lançamento da transação
    dataFinal?: Date // Data final da recorrência (opcional)
    contaLiquidacao?: Conta // Conta de Liquidação
    origem?: string; // Origem da transação
    categoria?: string | undefined;
    liquidacao: TipoLiquidacao;
}

export class TransacaoImpl implements ITransacao {
    _id?: string; // Identificador único da transação (quando persistida)
    descricao!: string; // Descrição da transação
    valor!: number; // Valor da transação
    tipoTransacao!: TipoTransacao; // Tipo de transação
    periodicidade!: Periodicidade; // Periodicidade da transação (mensal, trimestral, anual, etc.)
    dataInicial!: Date; // Data de vencimento da transação
    dataLiquidacao?: Date; // Data de vencimento da transação
    dataFinal?: Date // Data final da recorrência (opcional)
    contaLiquidacao?: Conta // Conta de Liquidação
    origem?: string; // Origem da transação
    categoria?: string | undefined; // Categoria
    liquidacao!: TipoLiquidacao; // Tipo de liquidação

    constructor(valorInicial: Partial<ITransacao>) {
        this._id = valorInicial._id;
        this.descricao = valorInicial.descricao || '';
        this.valor = valorInicial.valor || 0;
        this.tipoTransacao = valorInicial.tipoTransacao || TipoTransacao.DEBITO;
        this.periodicidade = valorInicial.periodicidade || Periodicidade.MENSAL;
        this.dataInicial = valorInicial.dataInicial ? this.toDate(valorInicial.dataInicial) : new Date();
        this.dataLiquidacao = valorInicial.dataLiquidacao ? this.toDate(valorInicial.dataLiquidacao) : undefined;
        this.dataFinal = valorInicial.dataFinal ? this.toDate(valorInicial.dataFinal) : undefined;
        this.contaLiquidacao = valorInicial.contaLiquidacao;
        this.origem = valorInicial.origem;
        this.categoria = valorInicial.categoria;
        this.liquidacao = valorInicial.liquidacao || TipoLiquidacao.CONTA;
    }

    private toDate(d: any) {
        if (!d) return undefined;
        if (!!d && typeof d.getMonth === 'function') {
            return d;
        }
        return DateTime.fromISO(d).toJSDate();
    }

    get liquidada() {
        return !!this.dataLiquidacao;
    }

    get possuiOcorrencias() {
        return !this.liquidada && !!this.dataFinal && isAfter(this.dataFinal, this.dataInicial)
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

    public programacaoTransacoes({ inicio, fim }: { inicio: Date, fim: Date }) {
        let transacoes : TransacaoImpl[] = [];

        if (! this.dataLiquidacao) {
            let datas = this.programacaoDatas(fim);
    
            if (inicio !== undefined) {
                const dtInicio = addDays(inicio, -1) as Date;
                datas = datas.filter(data => isSameDay(data, dtInicio) || isSameDay(data, fim) || (isAfter(data, dtInicio) && isBefore(data, fim)));
            }
    
            transacoes = datas.filter(data => !isSameDay(data, this.dataInicial))
                .map(data => {
                    let d = new TransacaoImpl(this);
                    d.dataInicial = data;
                    delete d._id;
                    // delete d.dataFinal;
                    delete d.dataLiquidacao;
                    d.origem = this._id;
                    return d;
                });
        }

        transacoes.push(this);
        return transacoes
            .filter(transacao => isSameDay(transacao.dataInicial, inicio) || isSameDay(transacao.dataInicial, fim) || (isAfter(transacao.dataInicial, inicio) && isBefore(transacao.dataInicial, fim)))
            .sort((a, b) => a.dataInicial.getTime() - b.dataInicial.getTime());
    }

    get proxima(): TransacaoImpl | undefined {
        const proxima = new TransacaoImpl(this);
        switch (proxima.periodicidade) {
            case Periodicidade.ANUAL:
                proxima.dataInicial = addYears(this.dataInicial, 1);
                break;
            case Periodicidade.SEMESTRAL:
                proxima.dataInicial = addMonths(this.dataInicial, 6);
                break;
            case Periodicidade.TRIMESTRAL:
                proxima.dataInicial = addMonths(this.dataInicial, 3);
                break;
            case Periodicidade.MENSAL:
                proxima.dataInicial = addMonths(this.dataInicial, 1);
                break;
            case Periodicidade.QUINZENAL:
                proxima.dataInicial = addDays(this.dataInicial, 15);
                break;
            case Periodicidade.SEMANAL:
                proxima.dataInicial = addDays(this.dataInicial, 7);
                break;
            case Periodicidade.UNICO:
                return undefined;
        }
        proxima.dataLiquidacao = undefined;
        proxima._id = undefined;
        return proxima;
    }

    get entity() {
        let entity = Object.assign({}, this) as any;
        if (entity.dataFinal === undefined) entity.dataFinal = null;
        if (entity.dataInicial === undefined) entity.dataInicial = null; else entity.dataVencimento = entity.dataInicial;
        if (entity.dataLiquidacao === undefined) {
            entity.dataPagamento = null;
        }
        else {
            entity.dataPagamento = entity.dataLiquidacao;
        }
        return entity;
    }

    get dtInicialStr(): string {
        return format(this.dataInicial, 'yyyy-MM-dd');
    }

    set dtInicialStr(data: string) {
        this.dataInicial = parse(data, 'yyyy-MM-dd', startOfDay(new Date()))
    }

    get dtFinalStr(): string | undefined {
        return this.dataFinal ? format(this.dataFinal, 'yyyy-MM-dd') : undefined;
    }

    set dtFinalStr(data: string | undefined) {
        if (!data) {
            this.dataFinal = undefined
        }
        else {
            this.dataFinal = parse(data, 'yyyy-MM-dd', startOfDay(new Date()))
        }
    }

    get dtLancamentoStr(): string | undefined {
        return this.dataLiquidacao ? format(this.dataLiquidacao, 'yyyy-MM-dd') : undefined;
    }

    set dtLancamentoStr(data: string | undefined) {
        if (!data) {
            this.dataLiquidacao = undefined
        }
        else {
            this.dataLiquidacao = parse(data, 'yyyy-MM-dd', startOfDay(new Date()))
        }
    }

    get mesInicial() {
        return Object.values(Mes)[getMonth(this.dataInicial)]
    }


}