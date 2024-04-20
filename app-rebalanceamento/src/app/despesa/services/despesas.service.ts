import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DespesaProgramada } from 'src/app/despesa/models/despesa';

@Injectable({
  providedIn: 'root'
})
export class DespesasService {

  private sequence = 0;

  private despesas: DespesaProgramada[] = Object.assign([], DESPESAS);

  constructor() { 
    // TODO remover código
    this.despesas.sort((a,b)=>(a.id||0)-(b.id||0));
  }

  /**
   * Retorna um Observable que emite o array de todas as despesas.
   *
   * @returns {Observable<DespesaProgramada[]>} Um Observable que emite o array de todas as despesas.
   */
  obterDespesas(): Observable<DespesaProgramada[]> {
    return of(this.despesas);
  }

  /**
   * Retorna uma despesa específica da lista de despesas.
   *
   * @param id - O índice da despesa a ser recuperada.
   * @returns {Observable<DespesaProgramada>} Um Observable que emite a despesa especificada.
   */
  obter(id: number): Observable<DespesaProgramada> {
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
  removerDespesa(id: number): void {
    // Remove a despesa específica da lista de despesas.
    this.despesas.splice(id);
  }

  /**
   * Adiciona uma nova despesa à lista de despesas.
   *
   * @param despesa - O objeto de despesa a ser adicionado.
   * @returns {Observable<DespesaProgramada>} Um Observable que emite a despesa adicionada.
   */
  adicionarDespesa(despesa: DespesaProgramada): Observable<DespesaProgramada> {
    despesa.id = ++this.sequence;
    this.despesas.push(despesa);
    return of(despesa);
  }

  /**
   * Atualiza uma despesa existente na lista de despesas.
   *
   * @param despesa - O objeto de despesa a ser atualizado.
   * @returns {Observable<DespesaProgramada>} Um Observable que emite a despesa atualizada.
   */
  atualizarDespesa(despesa: DespesaProgramada): Observable<DespesaProgramada> {
    const index = this.despesas.findIndex((item) => item.id === despesa.id);
    this.despesas[index] = despesa;
    return of(despesa);
  }

}


const DESPESAS: DespesaProgramada[] = [
  {
    id: 1,
    nome: 'Aluguel',
    valor: 1200.00,
    diaVencimento: 10,
  },
  {
    id: 2,
    nome: 'Plano de Saúde',
    valor: 250.00,
    diaVencimento: 5
  },
  {
    id: 3,
    nome: 'Internet e Luz',
    valor: 200.00,
    diaVencimento: 20
  },
  {
    id: 4,
    nome: 'Telefone Celular',
    valor: 80.00,
    diaVencimento: 15
  },
  {
    id: 5,
    nome: 'Supermercado',
    valor: 500.00,
    diaVencimento: 25
  },
  {
    id: 6,
    nome: 'Academia',
    valor: 100.00,
    diaVencimento: 7
  },
  {
    id: 7,
    nome: 'Streaming',
    valor: 50.00,
    diaVencimento: 1
  },
  {
    id: 8,
    nome: 'Transporte',
    valor: 300.00,
    diaVencimento: 18
  },
  {
    id: 9,
    nome: 'Lazer',
    valor: 200.00,
    diaVencimento: 22
  },
  {
    id: 10,
    nome: 'Outros',
    valor: 150.00,
    diaVencimento: 30
  }
];
