import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { Periodicidade, TipoLiquidacao, TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { MatrizTransacoes, TransacaoMatrizService } from './transacao-matriz.service';
import { TransacaoService } from './transacao.service';

describe('TransacaoMatrizService', () => {
  let service: TransacaoMatrizService;
  let transacaoService = new TransacaoService({} as HttpClient, {} as AlertService, {} as NgbModal);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: TransacaoService, useValue: transacaoService}
      ]
    });
    service = TestBed.inject(TransacaoMatrizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('montar matriz não deve sobrepor ocorrencias de uma mesma descricao ', () => {
    const transacoes: TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        periodicidade: Periodicidade.MENSAL,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 10, 1),
        liquidacao: TipoLiquidacao.CORRENTE
      },
      {
        _id: '123',
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        periodicidade: Periodicidade.MENSAL,
        dataInicial: new Date(2020, 2, 1),
        dataFinal: new Date(2020, 11, 1),
        dataLiquidacao: new Date(2020, 2, 1),
        liquidacao: TipoLiquidacao.CORRENTE
      }
    ].map(i => new TransacaoImpl(i));

    const matriz = service.montarMatriz(transacoes);
    const t1 = matriz.get('Transacao 1');
    expect(t1).toBeDefined();

    if (!t1) throw "t1 não definido";

    for (var mes = 0; mes < 12; mes++) {
      expect(t1[mes]).toBeDefined();
      expect(t1[mes].length * (mes + 1)).toBe(mes + 1);
    }
  })

  it('montar matriz deve distribuir transacoes nos meses', () => {
    const transacoes: TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        periodicidade: Periodicidade.MENSAL,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 2, 1),
        liquidacao: TipoLiquidacao.CORRENTE
      },
      {
        descricao: 'Transacao 2',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        periodicidade: Periodicidade.MENSAL,
        dataInicial: new Date(2020, 2, 1),
        dataFinal: new Date(2020, 2, 1),
        dataLiquidacao: new Date(2020, 2, 1),
        liquidacao: TipoLiquidacao.CORRENTE
      },
      {
        descricao: 'Transacao 3',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        periodicidade: Periodicidade.MENSAL,
        dataInicial: new Date(2020, 4, 1),
        dataFinal: new Date(2020, 10, 1),
        liquidacao: TipoLiquidacao.CORRENTE
      }
    ].map(i => new TransacaoImpl(i));

    const matriz = service.montarMatriz(transacoes);

    const t1 = matriz.get('Transacao 1');
    const t2 = matriz.get('Transacao 2');
    const t3 = matriz.get('Transacao 3');
    expect(t1).toBeTruthy();
    expect(t2).toBeTruthy();
    expect(t3).toBeTruthy();
    if (!!t1 && !!t2 && !!t3) {
      expect(t1[0]).toBeTruthy();
      expect(t1[0].length).toBe(1);
      expect(t1[1].length).toBe(1);
      expect(t1[2].length).toBe(1);
      expect(t1[3].length).toBe(0);
      expect(t2[0]).toBeTruthy();
      expect(t2[0].length).toBe(0);
      expect(t2[1].length).toBe(0);
      expect(t2[2].length).toBe(1);
      expect(t2[3].length).toBe(0);
      for (var mes = 0; mes < 4; mes++) {
        expect(t3[mes].length).toBe(0);
      }
      expect(t3[11].length).toBe(0);
      for (var mes = 4; mes < 11; mes++) {
        expect(t3[mes].length).toBe(1);
      }
    }
  })

  it('deve calcular total mensal considerando débitos e créditos', () => {
    const transacoes: TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.CREDITO,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
    ].map(i => new TransacaoImpl(i));

    const matriz = service.montarMatriz(transacoes);

    const totalAno = service.totalMes(matriz);
    const totalMes = service.totalMes(matriz, 1);

    expect(totalAno).toBe(-100);
    expect(totalMes).toBe(0);
  });

  it('deve calcular total por transacao considerando débitos e créditos', () => {
    const transacoes: TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicial: new Date(2020, 1, 1),
        dataFinal: new Date(2020, 1, 1)
      },
      {
        descricao: 'Transacao 2',
        valor: 100,
        tipoTransacao: TipoTransacao.CREDITO,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
    ].map(i => new TransacaoImpl(i));

    const matriz = service.montarMatriz(transacoes);

    const t1Mes0 = service.obterItensMatriz({
      matriz, mes: 0, nomeTransacao: 'Transacao 1'
    });
    expect(t1Mes0.length).toEqual(2);
  });

  it('deve obter as transacoes de uma celula da matriz', () => {
    const transacoes: TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicial: new Date(2020, 1, 1),
        dataFinal: new Date(2020, 1, 1)
      },
      {
        descricao: 'Transacao 2',
        valor: 100,
        tipoTransacao: TipoTransacao.CREDITO,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 0, 1)
      },
    ].map(i => new TransacaoImpl(i));

    const matriz = service.montarMatriz(transacoes);

    const t1Mes0 = service.obterItensMatriz({ matriz, mes: 0, nomeTransacao: 'Transacao 1' });
    const t1Mes1 = service.obterItensMatriz({ matriz, mes: 1, nomeTransacao: 'Transacao 1' });
    const t2Mes0 = service.obterItensMatriz({ matriz, mes: 0, nomeTransacao: 'Transacao 2' });
    const t2Mes1 = service.obterItensMatriz({ matriz, mes: 1, nomeTransacao: 'Transacao 2' });
    expect(t1Mes0.length).toEqual(2);
    expect(t1Mes1.length).toEqual(1);
    expect(t2Mes0.length).toEqual(1);
    expect(t2Mes1.length).toEqual(0);
  });

  it('Deve obter a data inicial de transação', ()=>{
    const transacoes: TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 3, 11)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 1, 18)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicial: new Date(2020, 5, 31)
      },
      {
        descricao: 'Transacao 2',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicial: new Date(2020, 0, 2)
      }].map(i => new TransacaoImpl(i));

    const matriz = service.montarMatriz(transacoes);
    const dia1 = service.obterDiaInicial({matriz, nomeTransacao: 'Transacao 1'});
    const dia2 = service.obterDiaInicial({matriz, nomeTransacao: 'Transacao 2'});
    expect(dia1).toBe(18)
    expect(dia2).toBe(2)
  })

  it('Deve obter os rótulos da matriz', ()=>{
    const transacoes: TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 3, 11)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicial: new Date(2020, 1, 18)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicial: new Date(2020, 5, 31)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicial: new Date(2020, 5, 19)
      },
      {
        descricao: 'Transacao 2',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicial: new Date(2020, 0, 2)
      }].map(i => new TransacaoImpl(i));

    spyOn(transacaoService, 'obterTransacoes').and.returnValue(of(transacoes))
  
    let matriz = service.montarMatriz(transacoes);
    let rotulos = service.rotulos(matriz);
    debugger;
    expect(rotulos).toBeTruthy();
    expect(rotulos.length).toBe(2);
    expect(rotulos[0]).toBe('Transacao 1');
    expect(rotulos[1]).toBe('Transacao 2');
  })

});
