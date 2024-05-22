import { TestBed } from '@angular/core/testing';

import { TransacaoMatrizService } from './transacao-matriz.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ITransacao, Periodicidade, TipoLiquidacao, TipoTransacao, TransacaoImpl } from '../models/transacao.model';

describe('TransacaoMatrizService', () => {
  let service: TransacaoMatrizService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ]
    });
    service = TestBed.inject(TransacaoMatrizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('montar matriz não deve sobrepor ocorrencias de uma mesma descricao ', () => {
    const transacoes : TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        periodicidade: Periodicidade.MENSAL,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 10, 1),
        liquidacao: TipoLiquidacao.CONTA
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
        liquidacao: TipoLiquidacao.CONTA
      }    
    ].map(i=>new TransacaoImpl(i));
    
    const matriz = service.montarMatriz(transacoes);
    const t1 = matriz.get('Transacao 1');
    expect(t1).toBeDefined();

    if (!t1) throw "t1 não definido";

    for (var mes = 0; mes < 12; mes++) {
      expect(t1[mes]).toBeDefined();
      expect(t1[mes].length * (mes+1)).toBe(mes+1);
    }
  })

  it('montar matriz deve distribuir transacoes nos meses', () => {
    const transacoes : TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        periodicidade: Periodicidade.MENSAL,
        dataInicial: new Date(2020, 0, 1),
        dataFinal: new Date(2020, 2, 1),
        liquidacao: TipoLiquidacao.CONTA
      },
      {
        descricao: 'Transacao 2',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        periodicidade: Periodicidade.MENSAL,
        dataInicial: new Date(2020, 2, 1),
        dataFinal: new Date(2020, 2, 1),
        dataLiquidacao: new Date(2020, 2, 1),
        liquidacao: TipoLiquidacao.CONTA
      },
      {
        descricao: 'Transacao 3',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        periodicidade: Periodicidade.MENSAL,
        dataInicial: new Date(2020, 4, 1),
        dataFinal: new Date(2020, 10, 1),
        liquidacao: TipoLiquidacao.CONTA
      }
    ].map(i=>new TransacaoImpl(i));

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
    const transacoes : TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicio: new Date(2020,0,1),
        dataFinal: new Date(2020,0,1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicio: new Date(2020,0,1),
        dataFinal: new Date(2020,0,1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicio: new Date(2020,0,1),
        dataFinal: new Date(2020,0,1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.CREDITO,
        dataInicio: new Date(2020,0,1),
        dataFinal: new Date(2020,0,1)
      },
    ].map(i=>new TransacaoImpl(i));

    const matriz = service.montarMatriz(transacoes);

    const totalAno = service.totalMes(matriz);
    const totalMes = service.totalMes(matriz, 1);

    expect(totalAno).toBe(-100);
    expect(totalMes).toBe(0);
  });

  it('deve calcular total por transacao considerando débitos e créditos', () => {
    const transacoes : TransacaoImpl[] = [
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicio: new Date(2020,0,1),
        dataFinal: new Date(2020,0,1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.DEBITO,
        dataInicio: new Date(2020,0,1),
        dataFinal: new Date(2020,0,1)
      },
      {
        descricao: 'Transacao 1',
        valor: 100,
        tipoTransacao: TipoTransacao.TRANSFERENCIA,
        dataInicio: new Date(2020,0,1),
        dataFinal: new Date(2020,0,1)
      },
      {
        descricao: 'Transacao 2',
        valor: 100,
        tipoTransacao: TipoTransacao.CREDITO,
        dataInicio: new Date(2020,0,1),
        dataFinal: new Date(2020,0,1)
      },
    ].map(i=>new TransacaoImpl(i));

    const matriz = service.montarMatriz(transacoes);

    debugger;
    const totalAno = service.totalAnual(matriz);
    const totalT1 = service.totalAnual(matriz, 'Transacao 1');
    const totalT2 = service.totalAnual(matriz, 'Transacao 2');

    expect(totalAno).toBe(-100);
    expect(totalT1).toBe(-200);
    expect(totalT2).toBe(100);
  });

});
