import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable, Observer, catchError, filter, map, mergeAll, of, tap } from 'rxjs';
import { DespesaRecorrenteImpl, IDespesaRecorrente, Mes, Periodicidade, TipoLiquidacao } from 'src/app/despesa/models/despesa.model';
import { AlertService } from 'src/app/services/alert.service';
import { formatRequestDate } from 'src/app/util/date-formatter.util';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DespesasService {

  constructor(private http: HttpClient, private alertService: AlertService) {  }

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

  obterDespesasParaAno(ano: number): Observable<DespesaRecorrenteImpl[]> {
    const inicioData = DateTime.now().set({year:ano}).startOf('year'); 
    const ateData = inicioData.endOf("year");

    return this.obterDespesas().pipe(
      map(despesas=>{
        return despesas.filter(despesa=>{
          return !despesa.dataVencimento || DateTime.fromJSDate(despesa.dataVencimento) > inicioData;
        });
      }),
      mergeAll(),
      map(despesa=>{
        return despesa.programacaoDespesas(ateData.toJSDate());
      })
    );
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

  private salvarDespesaSubscriber(observer: Observer<DespesaRecorrenteImpl>) {

  }

  salvarDespesa(despesa: DespesaRecorrenteImpl) : Observable<DespesaRecorrenteImpl> {
    const obDespesa = new Observable<DespesaRecorrenteImpl>((observer: Observer<DespesaRecorrenteImpl>)=>{
      const error = (error:any)=> {
        observer.error(error);
        this.alertService.alert({
          mensagem: `Erro ao atualizar despesa.${error.message ? '<br>\n<b>Origem:</b>' + error.message : ''}`,
          titulo: 'Resultado da operação',
          tipo: 'erro'
        });
      };

      if (!despesa._id) {
        this.adicionarDespesa(despesa)
          .subscribe({
            next: despesa => {
              observer.next(despesa);
              this.alertService.alert({
                mensagem: 'Despesa cadastrada com sucesso!',
                titulo: 'Resultado da operação',
                tipo: 'sucesso'
              });
            },
            error,
            complete: () => observer.complete()
          });
      }
      else {
        this.atualizarDespesa(despesa).subscribe({
          next: () => {
            this.alertService.alert({
              mensagem: 'Despesa atualizada com sucesso!',
              titulo: 'Resultado da operação',
              tipo: 'sucesso'
            })
          },
          error,
          complete: () => observer.complete()
        });
      }
    });

    return obDespesa;
  }
}
