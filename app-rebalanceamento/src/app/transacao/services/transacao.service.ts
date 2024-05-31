import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Observer, catchError, map } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { ITransacao, TransacaoImpl } from 'src/app/transacao/models/transacao.model';
import { formatRequestDate } from 'src/app/util/date-formatter.util';
import { environment } from 'src/environments/environment.development';
import { TransacaoModalComponent } from '../transacao-modal/transacao-modal.component';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  constructor(
    private _http: HttpClient,
    private _alertService: AlertService,
    private _modalService: NgbModal ) { }

  /**
   * Retorna um Observable que emite o array de todas as transacoes.
   *
   * @returns {Observable<TransacaoImpl[]>} Um Observable que emite o array de todas as transacoes.
   */
  obterTransacoes(): Observable<TransacaoImpl[]> {
    return this._http.get<TransacaoImpl[]>(`${environment.apiUrl}/transacao`)
      .pipe(
        map(result => {
          return result.map(item => new TransacaoImpl(item))
        }),
        catchError(error => {
          throw new Error(JSON.stringify(error));
        })
      )
  }

  /**
   * Retorna uma transacao específica da lista de transacoes.
   *
   * @param id - O índice da transacao a ser recuperada.
   * @returns {Observable<TransacaoImpl>} Um Observable que emite a transacao especificada.
   */
  obterTransacao(id: string): Observable<TransacaoImpl> {
    return this._http.get<ITransacao>(`${environment.apiUrl}/transacao/id/${id}`)
      .pipe(
        map(item => new TransacaoImpl(item)),
        catchError(error => {
          throw new Error(error);
        })
      );
  }

  /**
   * Remove uma transacao específica da lista de transacoes.
   *
   * @param id - O id da transacao a ser removida.
   */
  removerTransacao(id: string) {
    // Remove a transacao específica da lista de transacoes.
    return this._http.delete<ITransacao>(`${environment.apiUrl}/transacao/id/${id}`);
  }

  /**
   * Adiciona uma nova transacao à lista de transacoes.
   *
   * @param transacao - O objeto de transacao a ser adicionado.
   * @returns {Observable<TransacaoImpl>} Um Observable que emite a transacao adicionada.
   */
  adicionarTransacao(transacao: TransacaoImpl): Observable<TransacaoImpl> {
    const request = formatRequestDate(transacao);
    return this._http.post<ITransacao>(`${environment.apiUrl}/transacao`, request)
      .pipe(
        map(item => new TransacaoImpl(item)),
        catchError(error => {
          throw new Error(error);
        })
      )
  }

  /**
   * Atualiza uma transacao existente na lista de transacoes.
   *
   * @param transacao - O objeto de transacao a ser atualizado.
   * @returns {Observable<TransacaoImpl>} Um Observable que emite a transacao atualizada.
   */
  atualizarTransacao(transacao: TransacaoImpl): Observable<void> {
    const request = formatRequestDate(transacao);
    return this._http.put<void>(`${environment.apiUrl}/transacao`, request)
      .pipe(
        catchError(error => {
          throw new Error(error);
        })
      )
  }

  obterTransacoesIntervalo({ inicio, fim }: { inicio: Date; fim: Date; }): Observable<TransacaoImpl[]> {
    const ob = new Observable<TransacaoImpl[]>((observer: Observer<TransacaoImpl[]>)=>{
      this.obterTransacoes()
        .pipe(
          map(transacoes => {
            return transacoes.flatMap(transacao => {
              return transacao.programacaoTransacoes({inicio, fim});
            })
          }),
          catchError(error => {
            throw new Error(error);
          })
        )
        .subscribe(observer);
    });
    return ob;
  }

  /**
   * Salva uma transacao.
   *
   * @param transacao - A transacao a ser salva.
   * @returns Um Observable que emite a transacao salva.
   */
  salvarTransacao(transacao: TransacaoImpl): Observable<TransacaoImpl> {
    const obTransacao = new Observable<TransacaoImpl>((observer: Observer<TransacaoImpl>) => {

      const error = (error: any) => {
        observer.error(error);
        this._alertService.alert({
          mensagem: `Erro ao atualizar transacao. ${!!error.message ? '<br>\n<b>Origem:</b>' + error.message : ''}`,
          titulo: 'Resultado da operação',
          tipo: 'erro'
        });
      };

      if (!transacao._id) {
        const entity = transacao.entity;
        delete entity.dataFinal;
        entity.origem = transacao._id || transacao.origem;
        this.adicionarTransacao(entity).subscribe({
          next: entity => {
            observer.next(entity);
            this._alertService.alert({mensagem: 'Transacao cadastrada com sucesso!', titulo: 'Resultado da operação', tipo:'sucesso'});
          },
          error: (error)=>observer.error(error),
          complete: ()=>observer.complete()
        });
      }
      else {
        if (!! transacao.dataFinal && !! transacao.dataLiquidacao) {// então é ocorrência com pagamento
          const proxima = transacao.proxima;
          if (!! proxima) {
            proxima.dataFinal = undefined;
            this.salvarTransacao(proxima).subscribe(observer);
          }
        }

        this.atualizarTransacao(transacao.entity).subscribe({
          next: () => {
            observer.next(transacao);
            this._alertService.alert({mensagem: 'Transacao atualizada com sucesso!', titulo: 'Resultado da operação', tipo:'sucesso'});
            observer.complete();
          },
          error
        });
      }
    });

    return obTransacao;
  }

  editarTransacao(transacao: TransacaoImpl, titulo: string) {
    const ob = new Observable<TransacaoImpl>((observer: Observer<TransacaoImpl>) => {
      const modalRef = this._modalService.open(TransacaoModalComponent, { size: 'lg' });
      const component = modalRef.componentInstance as TransacaoModalComponent;
      component.transacao = transacao;
      component.titulo = titulo;

      component.onCancelar.subscribe((ev: any) => {
        modalRef.dismiss(ev);
        observer.complete();
      });

      component.onSalvar.subscribe((ev: any) => modalRef.close('Salvar'));

      component.onExcluir.subscribe((ev: any) => modalRef.dismiss('Excluir'));

      modalRef.result.then((result) => {
        this.salvarTransacao(transacao).subscribe({
          next: () => {
            observer.next(transacao);
          },
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      }, (reason) => {
        if (reason === 'Excluir') {
          if (!transacao._id) return;
          if (confirm(`Excluir transação ${transacao.descricao}`)) {
            this.removerTransacao(transacao._id).subscribe({
              next: () => {
                observer.next(transacao);
                this._alertService.alert({
                  mensagem: `Transação ${transacao.descricao} excluída`,
                  tipo: 'sucesso',
                  titulo: 'Resultado da operação'
                })
              },
              error: (error)=> observer.error(error),
              complete: ()=> observer.complete()
            })
            return;
          }
        }
        observer.complete();
      });
    });
    return ob;
  }

}
