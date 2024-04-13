import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Despesa } from 'src/app/despesa/models/despesa';

@Injectable({
  providedIn: 'root'
})
export class DespesasService {

  private sequence = 0;

  private despesas: Despesa[] = [];

  constructor() { }

  /**
   * Retorna um Observable que emite o array de todas as despesas.
   *
   * @returns {Observable<Despesa[]>} Um Observable que emite o array de todas as despesas.
   */
  getDespesas(): Observable<Despesa[]> {
    return of(this.despesas);
  }

  /**
   * Retorna uma despesa específica da lista de despesas.
   *
   * @param id - O índice da despesa a ser recuperada.
   * @returns {Observable<Despesa>} Um Observable que emite a despesa especificada.
   */
  obter(id: number): Observable<Despesa> {
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
   * @returns {Observable<Despesa>} Um Observable que emite a despesa adicionada.
   */
  adicionarDespesa(despesa: Despesa): Observable<Despesa> {
    despesa.id = ++this.sequence;
    this.despesas.push(despesa);
    return of(despesa);
  }

  /**
   * Atualiza uma despesa existente na lista de despesas.
   *
   * @param despesa - O objeto de despesa a ser atualizado.
   * @returns {Observable<Despesa>} Um Observable que emite a despesa atualizada.
   */
  atualizarDespesa(despesa: Despesa): Observable<Despesa> {
    const index = this.despesas.findIndex((item) => item.id === despesa.id);
    this.despesas[index] = despesa;
    return of(despesa);
  }

}
