import { Component, ViewChild } from '@angular/core';
import { endOfMonth, getDate, getMonth, set, startOfDay } from 'date-fns';
import { PopupMenuComponent } from 'src/app/util/popup-menu/popup-menu.component';
import { Mes, Periodicidade, TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { MatrizType, TransacaoMatrizService } from '../services/transacao-matriz.service';
import { TransacaoService } from '../services/transacao.service';

class Linha {

  matriz!: MatrizType<TransacaoImpl>;

  celulas: Celula[] = new Array(12);

  diaInicial?: number;

  constructor(matriz: MatrizType<TransacaoImpl>) {
    this.matriz = matriz;
  }

  get total() {
    return this.celulas.reduce((total, celula) => total + celula.total, 0);
  }

  get nomeTransacao() {
    return this.celulas[0].nomeTransacao
  }

}

class Celula {
  
  linha!: Linha;

  nomeTransacao!: string;

  mes!: number;

  transacoes!: TransacaoImpl[];

  constructor(linha: Linha, nomeTransacao: string, mes: number, transacoes: TransacaoImpl[]) {
    this.linha = linha;
    this.nomeTransacao = nomeTransacao;
    this.mes = mes;
    this.transacoes = transacoes;
  }

  get total() {
    return this.transacoes.reduce((total, transacao) => total + (transacao.tipoTransacao == TipoTransacao.DEBITO ? - transacao.valor : transacao.valor), 0);
  }

  get ehUnico() {
    return this.transacoes.length < 2;
  }

  get classe() {
    return {
      liquidado: ! this.transacoes.find(transacao=>! transacao.dataLiquidacao),
      debito: !! this.transacoes.length && this.transacoes[0].tipoTransacao == TipoTransacao.DEBITO,
      credito: !! this.transacoes.length && this.transacoes[0].tipoTransacao == TipoTransacao.CREDITO,
      transferencia: !! this.transacoes.length && this.transacoes[0].tipoTransacao == TipoTransacao.TRANSFERENCIA,
      projecao: ! this.transacoes.find(transacao=> transacao._id)
    } || {}
  }

}

@Component({
  selector: 'app-transacao-list',
  templateUrl: './transacao-list.component.html',
  styleUrls: ['./transacao-list.component.scss']
})
export class TransacaoListComponent {

  @ViewChild(PopupMenuComponent) menu!: PopupMenuComponent;

  rotulos: string[] = [];
  linhas: Linha[] = [];

  popupTransacoes : TransacaoImpl[] = [];

  private _visao!: Periodicidade;

  constructor(
    private _transacaoService: TransacaoService,
    private _matrizService: TransacaoMatrizService,
  ) {}

  ngOnInit(): void {
    this.obterTransacoes();
  }

  public get visao(): Periodicidade {
    return this._visao;
  }
  public set visao(value: Periodicidade) {
    this._visao = value;

    // this.transacoes.forEach(transacao => {
    //   const descricao = transacao.descricao || 'Não classificado';
    //   let periodo;
    //   switch (this.visao) {
    //     case Periodicidade.SEMANAL:
    //     case Periodicidade.QUINZENAL:
    //     case Periodicidade.MENSAL:
    //       periodo = getDate(transacao.dataInicial);
    //       break;
    //     case Periodicidade.TRIMESTRAL:
    //     case Periodicidade.SEMESTRAL:
    //     case Periodicidade.ANUAL:
    //     default:
    //       periodo = Object.keys(Mes)[getMonth(transacao.dataInicial)];
    //       break;
    //   }
    // });
  }

  get tiposPeriodo() {
    return [Periodicidade.ANUAL, Periodicidade.SEMESTRAL, Periodicidade.TRIMESTRAL, Periodicidade.MENSAL, Periodicidade.QUINZENAL, Periodicidade.SEMANAL];
  }

  classeLancamento(transacao: TransacaoImpl | undefined) {
    return transacao && {
      liquidado: !!transacao.dataLiquidacao,
      debito: transacao.tipoTransacao == TipoTransacao.DEBITO,
      credito: transacao.tipoTransacao == TipoTransacao.CREDITO,
      projecao: !transacao._id,
      transferencia: transacao.tipoTransacao == TipoTransacao.TRANSFERENCIA,
      semorigem: !transacao.origem
    } || {}
  }
  
  obterTransacoes() {
    this._matrizService.obterTransacoes().subscribe(matriz=>{
      this.rotulos = this._matrizService.rotulos(matriz);

      this.linhas = this.rotulos.map(nomeTransacao => {
        const linhaTransacoes = matriz.get(nomeTransacao);

        if (!linhaTransacoes) throw `${nomeTransacao} não encontrado`;

        const linha = new Linha(matriz);
        linha.celulas = Object.values(linhaTransacoes).map((transacoes, mes) => {
          if (!linha.diaInicial) {
            const transacao = transacoes.find(transacao => !!transacao.dataInicial);
            transacao && (linha.diaInicial = getDate(transacao?.dataInicial));
          }
          return new Celula(linha, nomeTransacao, mes, transacoes);
        });

        return linha;
      }).sort((l1,l2)=>((l1.diaInicial || 0) - (l2.diaInicial || 0))*1000 + l1.nomeTransacao.localeCompare(l2.nomeTransacao));
    });

  }

  get periodos() {
    switch (this.visao) {
      case Periodicidade.SEMANAL:
      case Periodicidade.QUINZENAL:
      case Periodicidade.MENSAL:
        const mes = Object.keys(Periodicidade).indexOf(this.periodoCorrente);
        const primeiroDia = startOfDay(set(new Date(), {month: mes, date: 1}));
        const ultimoDia = endOfMonth(primeiroDia);
        return [...Array(getDate(ultimoDia))].map((_d,index)=>index+1).map(d=>d.toString() as string);
      case Periodicidade.TRIMESTRAL:
      case Periodicidade.SEMESTRAL:
      case Periodicidade.ANUAL:
        default:
        return Object.keys(Mes);
    }
  }
  
  obterCelula(mes: number, linha: number) {
    return this.linhas[linha].celulas[mes];
  }

  obterTransacaoCelula(mes: number, linha: number, indice: number) {
    const celula = this.obterCelula(mes, linha);
    return celula.transacoes[indice]
  }

  diaInicial(linha: number) {
    const transacoes = this.obterCelula(0, linha).transacoes;
    return transacoes
  }

  get periodoCorrente() {
    switch (this.visao) {
      case Periodicidade.SEMANAL:
      case Periodicidade.QUINZENAL:
      case Periodicidade.MENSAL:
        return getDate(new Date()).toString();
      case Periodicidade.TRIMESTRAL:
      case Periodicidade.SEMESTRAL:
      case Periodicidade.ANUAL:
        default:
          const mesCorrente = getMonth(new Date());
          return Object.values(Mes)[mesCorrente];
    }
  }
  
  totalMes(mes: number) {
    if (!this.linhas.length) return 0;
    return this.linhas.reduce((acc, vl, indice)=>{
      return acc + this.obterCelula(mes, indice).total;
    },0);
  }

  get totalGeral() {
    return this.linhas.reduce((acc, linha)=>acc += linha.total, 0)
  }

  editarTransacao(transacao: TransacaoImpl | undefined, titulo: string) {
    if (!!transacao) {
      this._transacaoService.editarTransacao(transacao, titulo).subscribe(()=>{
        this.obterTransacoes();
      })
    }
  }

  criarTransacao() {
    this.editarTransacao(new TransacaoImpl({}), "Criar transação");
  }

  abrirPopupTransacoes(transacoes: any, e: MouseEvent) {
    this.popupTransacoes = transacoes;
    this.menu.open(e)
  }
}

