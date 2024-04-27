import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DespesaRecorrenteImpl, IDespesaRecorrente, Periodicidade, TipoLiquidacao } from 'src/app/despesa/models/despesa.model';

@Injectable({
  providedIn: 'root'
})
export class DespesasService {

  private sequence = 0;

  private despesas: DespesaRecorrenteImpl[] = DESPESAS.map(despesa=>new DespesaRecorrenteImpl(despesa));

  constructor() { 
    // TODO remover código
    this.obterDespesas().subscribe(despesas=>{
      despesas.forEach(despesa=>despesa.id = this.uuidv4());
      this.despesas = despesas;
      this.despesas.sort((a,b)=>(a.diaVencimento||0)-(b.diaVencimento||0));
    });
  }

  uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  }
  
  /**
   * Retorna um Observable que emite o array de todas as despesas.
   *
   * @returns {Observable<DespesaRecorrenteImpl[]>} Um Observable que emite o array de todas as despesas.
   */
  obterDespesas(): Observable<DespesaRecorrenteImpl[]> {
    return of(this.despesas);
  }

  /**
   * Retorna uma despesa específica da lista de despesas.
   *
   * @param id - O índice da despesa a ser recuperada.
   * @returns {Observable<DespesaRecorrenteImpl>} Um Observable que emite a despesa especificada.
   */
  obterDespesa(id: string): Observable<DespesaRecorrenteImpl> {
    const despesa = this.despesas.find((item) => item.id === id);
    if (!despesa)
      throw new Error('Despesa não encontrada');
    return of(despesa);
  }

  /**
   * Remove uma despesa específica da lista de despesas.
   *
   * @param id - O id da despesa a ser removida.
   */
  removerDespesa(id: string): void {
    // Remove a despesa específica da lista de despesas.
    this.despesas = this.despesas.filter(despesa=>despesa.id!==id);
  }

  /**
   * Adiciona uma nova despesa à lista de despesas.
   *
   * @param despesa - O objeto de despesa a ser adicionado.
   * @returns {Observable<DespesaRecorrenteImpl>} Um Observable que emite a despesa adicionada.
   */
  adicionarDespesa(despesa: DespesaRecorrenteImpl): Observable<DespesaRecorrenteImpl> {
    despesa.id = this.uuidv4();
    this.despesas.push(despesa);
    return of(despesa);
  }

  /**
   * Atualiza uma despesa existente na lista de despesas.
   *
   * @param despesa - O objeto de despesa a ser atualizado.
   * @returns {Observable<DespesaRecorrenteImpl>} Um Observable que emite a despesa atualizada.
   */
  atualizarDespesa(despesa: DespesaRecorrenteImpl): Observable<DespesaRecorrenteImpl> {
    const index = this.despesas.findIndex((item) => item.id === despesa.id);
    this.despesas[index] = despesa;
    return of(despesa);
  }

}


const DESPESAS: IDespesaRecorrente[] = [
  {
    descricao: 'Aluguel',
    valor: 1200.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 0, 10),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    descricao: 'Plano de Saúde',
    valor: 250.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 1, 5),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    descricao: 'Internet e Luz',
    valor: 200.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 5, 20),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    descricao: 'Telefone Celular',
    valor: 80.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 1, 15),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    descricao: 'Supermercado',
    valor: 500.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 1, 25),
    dataFinal: new Date(2024, 7, 11),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    descricao: 'Academia',
    valor: 100.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 1, 7),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    id: 'cb5f1762-4c5c-4d19-b79e-5460d78003b5',
    descricao: 'Streaming',
    valor: 40.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 0, 2),
    dataPagamento: new Date(2024, 0, 2),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    descricao: 'Streaming',
    valor: 50.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 1, 2),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    descricao: 'Transporte',
    valor: 300.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 1, 18),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    descricao: 'Lazer',
    valor: 200.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 1, 22),
    liquidacao: TipoLiquidacao.CONTA
  },
  {
    descricao: 'Outros',
    valor: 150.00,
    periodicidade: Periodicidade.MENSAL,
    dataVencimento: new Date(2024, 0, 30),
    liquidacao: TipoLiquidacao.CONTA
  }
];
