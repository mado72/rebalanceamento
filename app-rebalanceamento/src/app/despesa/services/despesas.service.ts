import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { DespesaRecorrenteImpl, IDespesaRecorrente, Periodicidade, TipoLiquidacao } from 'src/app/despesa/models/despesa.model';
import { formatRequestDate } from 'src/app/util/date-formatter.util';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DespesasService {

  constructor(private http: HttpClient) {  }

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
    return this.http.get<IDespesaRecorrente[]>(`${environment.apiUrl}/despesa`)
      .pipe(
        map(result=>{
          return result.map(item=>new DespesaRecorrenteImpl(item))
        }),
        catchError(error=>{
          throw new Error(JSON.stringify(error));
        })
      )
  }

  /**
   * Retorna uma despesa específica da lista de despesas.
   *
   * @param id - O índice da despesa a ser recuperada.
   * @returns {Observable<DespesaRecorrenteImpl>} Um Observable que emite a despesa especificada.
   */
  obterDespesa(id: string): Observable<DespesaRecorrenteImpl> {
    return this.http.get<IDespesaRecorrente>(`${environment.apiUrl}/despesa/id/${id}`)
      .pipe(
        map(item=>new DespesaRecorrenteImpl(item)),
        catchError(error=>{
          throw new Error(error);
        })
      );
  }

  /**
   * Remove uma despesa específica da lista de despesas.
   *
   * @param id - O id da despesa a ser removida.
   */
  removerDespesa(id: string) {
    // Remove a despesa específica da lista de despesas.
    return this.http.delete<IDespesaRecorrente>(`${environment.apiUrl}/despesa/id/${id}`);
  }

  /**
   * Adiciona uma nova despesa à lista de despesas.
   *
   * @param despesa - O objeto de despesa a ser adicionado.
   * @returns {Observable<DespesaRecorrenteImpl>} Um Observable que emite a despesa adicionada.
   */
  adicionarDespesa(despesa: DespesaRecorrenteImpl): Observable<DespesaRecorrenteImpl> {
    const request = formatRequestDate(despesa);
    return this.http.post<IDespesaRecorrente>(`${environment.apiUrl}/despesa`, request)
      .pipe(
        map(item=>new DespesaRecorrenteImpl(item)),
        catchError(error=>{
          throw new Error(error);
        })
      )
  }

  /**
   * Atualiza uma despesa existente na lista de despesas.
   *
   * @param despesa - O objeto de despesa a ser atualizado.
   * @returns {Observable<DespesaRecorrenteImpl>} Um Observable que emite a despesa atualizada.
   */
  atualizarDespesa(despesa: DespesaRecorrenteImpl): Observable<void> {
    const request = formatRequestDate(despesa);
    return this.http.put<void>(`${environment.apiUrl}/despesa`, request)
      .pipe(
        catchError(error=>{
          throw new Error(error);
        })
      )
  }

}
