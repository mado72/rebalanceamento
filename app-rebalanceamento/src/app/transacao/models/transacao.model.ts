import { add, addDays, addMonths, addYears, endOfDay, format, getMonth, isAfter, isBefore, isSameDay, isValid, isWithinInterval, parse, startOfDay } from "date-fns";
import { Conta } from "../../conta/model/conta.model";

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
    CORRENTE = 'CONTA',
    CARTAO = 'CARTAO'
}

export enum TipoTransacao {
    DEBITO = 'DEBITO',
    CREDITO = 'CREDITO',
    TRANSFERENCIA = 'TRANSFERENCIA',
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
    contaLiquidacao?: string // Conta de Liquidação
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
    contaLiquidacao?: string // Conta de Liquidação
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
        this.liquidacao = valorInicial.liquidacao || TipoLiquidacao.CORRENTE;
    }

    private toDate(d: any) {
        if (!d) return undefined;
        if (!!d && typeof d.getMonth === 'function') {
            return d;
        }
        const data = !!d? parse(d, 'yyyy-MM-dd', new Date()) : undefined;

        if (data !== undefined && !isValid(data)) {
            throw new Error(`Invalid date ${d}`);
        }
        return data;
    }

    get projecao() {
        return !this._id;
    }

    get liquidada() {
        return !!this.dataLiquidacao;
    }

    get possuiOcorrencias() {
        return !this.liquidada && !!this.dataFinal && isAfter(this.dataFinal, this.dataInicial)
    }

    public programacaoDatas(ateData: Date) {
        const datas = new Array<Date>();
        let dataFinalPeriodo = endOfDay(ateData);
        if (!!this.dataFinal && isAfter(dataFinalPeriodo, this.dataFinal)) {
            dataFinalPeriodo = endOfDay(this.dataFinal);
        }

        let data = startOfDay(this.dataInicial);

        while (isBefore(data, dataFinalPeriodo)) {
            datas.push(data);
            switch (this.periodicidade) {
                case Periodicidade.UNICO:
                    return datas;
                case Periodicidade.SEMANAL:
                    data = add(data, { weeks: 1 });
                    break;
                case Periodicidade.QUINZENAL:
                    data = add(data, { weeks: 2 });
                    break;
                case Periodicidade.MENSAL:
                    data = add(data, { months: 1 });
                    break;
                case Periodicidade.TRIMESTRAL:
                    data = add(data, { months: 3 });
                    break;
                case Periodicidade.SEMESTRAL:
                    data = add(data, { months: 6 });
                    break;
                case Periodicidade.ANUAL:
                    data = add(data, { years: 1 });
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
            .filter(transacao =>{
            //     isSameDay(transacao.dataInicial, inicio) || isSameDay(transacao.dataInicial, fim) || (isAfter(transacao.dataInicial, inicio) && isBefore(transacao.dataInicial, fim))
                const igualDataInicial = isSameDay(transacao.dataInicial, inicio);
                const igualDataFinal = isSameDay(transacao.dataInicial, fim);
                const entreDatas = isWithinInterval(transacao.dataInicial, {start: inicio, end: fim});
                return igualDataInicial || igualDataFinal || entreDatas;
            })
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
            entity.dataLiquidacao = null;
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
        return isValid(this.dataLiquidacao) ? format(this.dataLiquidacao as Date, 'yyyy-MM-dd') : undefined;
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