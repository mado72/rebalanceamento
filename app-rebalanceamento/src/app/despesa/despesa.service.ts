import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Despesa } from 'src/app/despesa/despesa';

@Injectable({
  providedIn: 'root'
})
export class DespesaService {

  private despesas: Despesa[] = [];

  constructor() { }

  /**
   * Returns an Observable that emits the array of all expenses.
   *
   * @returns {Observable<Despesa[]>} An Observable that emits the array of all expenses.
   */
  getDespesas(): Observable<Despesa[]> {
    return of(this.despesas);
  }

  /**
   * Retrieves a specific expense from the list of expenses.
   *
   * @param id - The index of the expense to be retrieved.
   * @returns {Observable<Despesa>} An Observable that emits the expense object at the specified index.
   */
  get(id: number): Observable<Despesa> {
    return of(this.despesas[id]);
  }

  /**
   * Removes a specific expense from the list of expenses.
   *
   * @param indice - The index of the expense to be removed.
   */
  removerDespesa(indice: number): void {
    // Removes the expense at the specified index from the list of expenses.
    this.despesas.splice(indice);
  }

  /**
   * Adds a new expense to the list of expenses.
   *
   * @param despesa - The expense object to be added.
   * @returns {Observable<Despesa>} An Observable that emits the newly added expense.
   */
  adicionarDespesa(despesa: Despesa): Observable<Despesa> {
    this.despesas.push(despesa);
    return of(despesa);
  }

  /**
   * Updates an existing expense in the list of expenses.
   *
   * @param id - The id of the expense
   * @param despesa - The expense object to be updated.
   * @returns {Observable<Despesa>} An Observable that emits the updated expense.
   */
  atualizarDespesa(id: number, despesa: Despesa): Observable<Despesa> {
    this.despesas[id] = despesa;
    return of(despesa);
  }

}
