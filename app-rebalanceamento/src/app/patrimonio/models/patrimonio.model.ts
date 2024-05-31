export enum TipoConsolidado {
    CONTA = "CONTA",
    ACAO = "ACAO",
    FII = "FII",
    RF = "RF",
    INTL = "INTL",
    TRADE = "TRADE",
    RESERVA = "RESERVA",
    CRIPTO = "CRIPTO",
    SWING = "SWING",
    PROVENTO = "PROVENTO",
    RETIRADA = "RETIRADA"
}


export interface IConsolidado {
    _id?: string,
    idRef: string,
    tipo : TipoConsolidado,
    valor: number,
    anoMes: number
}

export class Consolidado implements IConsolidado {
    _id?: string;
    idRef!: string;
    tipo! : TipoConsolidado;
    valor!: number;
    private _anoMes!: number;

    constructor(obj: IConsolidado) {
        this._id = obj._id;
        this.idRef = obj.idRef;
        this.tipo = obj.tipo;
        this.valor = obj.valor;
        this._anoMes = obj.anoMes;
    }

    private validaAnoMes(anoMes: number) {
        if (!anoMes || isNaN(anoMes)) throw `anoMes deve ser um número`;
        const ano = anoMes / 100;
        const mes = anoMes % 100;
        if (mes < 1 || mes > 12) throw `mes deve ser um número entre 1 e 12: ${mes}`;
        if (ano < 1900 || ano > 2100) throw `ano deve ser um número entre 1900 e 2100: ${ano}`;
        return anoMes;
    }

    get anoMes(): number {
        return this._anoMes;
    }

    set anoMes(value: number) {
        this._anoMes = this.validaAnoMes(value);
    }
}
