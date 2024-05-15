import { Mes, Periodicidade } from 'src/app/transacao/models/transacao.model';
import { DespesaRecorrenteImpl } from './despesa.model';

describe('Despesa', () => {
  it('should create an instance', () => {
    expect(new DespesaRecorrenteImpl({
      dataVencimento: new Date(),
      descricao: 'descricao',
      valor: 1000,
      periodicidade: Periodicidade.MENSAL,
    })).toBeTruthy();
  });

  it('Deve obter dia de vencimento 20', ()=>{
    const despesa = new DespesaRecorrenteImpl({
      dataVencimento: new Date(2020, 0, 20),
      descricao: 'descricao',
      valor: 1000,
      periodicidade: Periodicidade.MENSAL,
    });
    expect(despesa.diaVencimento).toBe(20);
  })

  it('Deve obter mes de vencimento ABRIL', () => {
    const despesa = new DespesaRecorrenteImpl({
      dataVencimento: new Date(2020, 3, 20),
      descricao: 'descricao',
      valor: 1000,
      periodicidade: Periodicidade.MENSAL,
    });
    expect(despesa.mesVencimento).toBe(Mes.ABRIL);
  })

  it('Deve obter 4 datas programadas por periodicidade Mensal', ()=>{
    const despesa = new DespesaRecorrenteImpl({
      dataVencimento: new Date(2020, 0, 20),
      descricao: 'descricao',
      valor: 1000,
      periodicidade: Periodicidade.MENSAL,
    });
    const datas = despesa.programacaoDatas(new Date(2020, 3, 20));
    expect(datas.length).toBe(4);
  })

  it('Deve obter 3 datas programadas por periodicidade Mensal', ()=>{
    const despesa = new DespesaRecorrenteImpl({
      dataVencimento: new Date(2020, 0, 20),
      descricao: 'descricao',
      valor: 1000,
      periodicidade: Periodicidade.MENSAL,
    });
    const datas = despesa.programacaoDatas(new Date(2020, 3, 19));
    expect(datas.length).toBe(3);
  })

  it('Deve obter 7 datas programadas por periodicidade Quinzenal', ()=>{
    const despesa = new DespesaRecorrenteImpl({
      dataVencimento: new Date(2024, 0, 20),
      descricao: 'descricao',
      valor: 1000,
      periodicidade: Periodicidade.QUINZENAL,
    });
    const datas = despesa.programacaoDatas(new Date(2024, 3, 19));
    expect(datas.length).toBe(7);
  })

  it('Deve obter 1 data programada por periodicidade Anual', ()=>{
    const despesa = new DespesaRecorrenteImpl({
      dataVencimento: new Date(2024, 0, 20),
      descricao: 'descricao',
      valor: 1000,
      periodicidade: Periodicidade.ANUAL,
    });
    const datas = despesa.programacaoDatas(new Date(2024, 3, 19));
    expect(datas.length).toBe(1);
  })
});
