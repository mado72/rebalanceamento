import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { AtivoImpl, CarteiraImpl, IAtivo, Moeda, TipoAtivo } from '../ativos/model/ativos.model';
import { CarteiraService } from '../ativos/services/carteira.service';
import { Conta } from '../conta/model/conta.model';
import { ContaService } from '../conta/services/conta.service';
import { ConsolidadoService } from '../patrimonio/services/consolidado.service';
import { AlertService } from '../services/alert.service';
import { TipoTransacao, TransacaoImpl } from '../transacao/models/transacao.model';
import { MatrizTransacoes, TransacaoMatrizService } from '../transacao/services/transacao-matriz.service';
import { TransacaoService } from '../transacao/services/transacao.service';


class ContaServiceMock {

  obterContas(_params: any): Observable<Conta[]> {
    return of([]);
  }
}

class CarteiraServiceMock {
  obterCarteiras(_params: any): Observable<CarteiraImpl[]> {
    return of([]);
  }
  obterTodosAtivos(): Observable<AtivoImpl[]> {
    return of(ATIVOS.map(ativo=>new AtivoImpl(ativo)))
  }
}

class ConsolidadoServiceMock {

}
class AlertServiceMock {
  alert(v: any) {
    console.debug(v);
  }
}
class NgbModalMock {

}
class ActivatedRouteMock {
  snapshot = {
    params: {

    },
    data: {

    }
  }
}
class TransacaoServiceMock {
  obterTransacoesIntervalo(params: any): Observable<TransacaoImpl[]> {
    return of([]);
  }
}

class TransacaoMatrizServiceMock {
  matriz: MatrizTransacoes = new Map([
    ["Transacao 1", 
      {
        0: [],
        1: [new TransacaoImpl({
          descricao: 'Transacao 1',
          valor: 100,
          tipoTransacao: TipoTransacao.DEBITO,
          dataInicial: new Date(2020, 1, 18)
        })],
        2: [],
        3: [new TransacaoImpl({
          descricao: 'Transacao 1',
          valor: 100,
          tipoTransacao: TipoTransacao.DEBITO,
          dataInicial: new Date(2020, 3, 11)
        })],
        4: [],
        5: [new TransacaoImpl({
          descricao: 'Transacao 1',
          valor: 100,
          tipoTransacao: TipoTransacao.DEBITO,
          dataInicial: new Date(2020, 5, 31)
        })]
      }
    ],
    ["Transacao 2", 
    {
        0: [],
        1: [new TransacaoImpl({
          descricao: 'Transacao 2',
          valor: 100,
          tipoTransacao: TipoTransacao.TRANSFERENCIA,
          dataInicial: new Date(2020, 1, 18)
        })],
        2: [],
        3: [],
        4: [],
        5: [
          new TransacaoImpl({
            descricao: 'Transacao 2',
            valor: 100,
            tipoTransacao: TipoTransacao.TRANSFERENCIA,
            dataInicial: new Date(2020, 5, 12)
          }),
          new TransacaoImpl({
            descricao: 'Transacao 2',
            valor: 200,
            tipoTransacao: TipoTransacao.TRANSFERENCIA,
            dataInicial: new Date(2020, 5, 13)
          })
        ]
      }
    ]
  ]);
    
  obterTransacoes(): Observable<MatrizTransacoes> {
    return of(this.matriz);
  }
  rotulos(matriz: MatrizTransacoes) {
    return new Array(...matriz.keys());
  }

  totalMes() {
    return 100;
  }
}

export const contaServiceMock = new ContaServiceMock();
export const consolidadoServiceMock = new ConsolidadoServiceMock();
export const alertServiceMock = new AlertServiceMock();
export const ngbModalMock = new NgbModalMock();
export const activatedRouteMock = new ActivatedRouteMock();
export const carteiraServiceMock = new CarteiraServiceMock();
export const transacaoServiceMock = new TransacaoServiceMock();
export const transacaoMatrizServiceMock = new TransacaoMatrizServiceMock();

export const carteiraProviders = [
  { provide: ContaService, useValue: contaServiceMock },
  { provide: CarteiraService, useValue: carteiraServiceMock },
];

export const patrimonioProviders = [
  { provide: ConsolidadoService, useValue: consolidadoServiceMock },
]

export const utilProviders = [
  { provide: AlertService, useValue: alertServiceMock },
]

export const transacaoProviders = [
  { provide: TransacaoService, useValue: transacaoServiceMock },
  { provide: TransacaoMatrizService, useValue: transacaoMatrizServiceMock },
]

export const appProviders = [
  ...utilProviders,
 ...carteiraProviders,
 ...transacaoProviders,
 ...patrimonioProviders
]

export const ngProviders = [
  { provide: NgbModal, useValue: ngbModalMock },
  { provide: ActivatedRoute, useValue: activatedRouteMock },
]

registerLocaleData(localePt);

export const n18iProviders = [
  {provide: LOCALE_ID, useValue: 'pt' },
]
export const allProviders = [
  ...appProviders,
  ...n18iProviders,
  ...ngProviders
]


const ATIVOS : IAtivo[] = [
  {
    nome: 'Ativo 1',
    sigla: 'A1',
    tipoAtivo: TipoAtivo.ACAO,
    moeda: Moeda.USD
  },
  {
    nome: 'Ativo 2',
    sigla: 'A2',
    tipoAtivo: TipoAtivo.ACAO,
    moeda: Moeda.USD
  },
  {
    nome: 'Ativo 3',
    sigla: 'A3',
    tipoAtivo: TipoAtivo.ACAO,
    moeda: Moeda.BRL
  },
  {
    nome: 'Ativo 4',
    sigla: 'F4',
    tipoAtivo: TipoAtivo.FII,
    moeda: Moeda.BRL
  },
  {
    nome: 'Ativo 5',
    sigla: 'F5',
    tipoAtivo: TipoAtivo.FII,
    moeda: Moeda.USD
  },
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class TestModule { }
