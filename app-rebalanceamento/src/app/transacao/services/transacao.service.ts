import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { addDays, addMonths, addYears, getTime } from 'date-fns';
import { DateTime } from 'luxon';
import { Observable, Observer, catchError, map, mergeAll } from 'rxjs';
import { ITransacao, Periodicidade, TipoTransacao, TransacaoImpl } from 'src/app/transacao/models/transacao.model';
import { AlertService } from 'src/app/services/alert.service';
import { formatRequestDate } from 'src/app/util/date-formatter.util';
import { environment } from 'src/environments/environment.development';
import { TransacaoModalComponent } from '../transacao-modal/transacao-modal.component';
import { DespesasService } from 'src/app/despesa/services/despesas.service';
import { DespesaRecorrenteImpl } from 'src/app/despesa/models/despesa.model';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {

  constructor(
    private _http: HttpClient,
    private _alertService: AlertService,
    private _modalService: NgbModal,
    private _despesaService: DespesasService ) { }

  /**
   * Retorna um Observable que emite o array de todas as transacoes.
   *
   * @returns {Observable<TransacaoImpl[]>} Um Observable que emite o array de todas as transacoes.
   */
  obterTransacoes(): Observable<TransacaoImpl[]> {
    return this._despesaService.obterDespesas()
      .pipe(
        map(despesas=>{
          return despesas.map(despesa=>{
            return this.converterDespesaEmTransacao(despesa);
          })
        })
      )
    // return this._http.get<TransacaoImpl[]>(`${environment.apiUrl}/transacoes`)
    //   .pipe(
    //     map(result => {
    //       return result.map(item => new TransacaoImpl(item))
    //     }),
    //     catchError(error => {
    //       throw new Error(JSON.stringify(error));
    //     })
    //   )
  }

  private converterDespesaEmTransacao(despesa: DespesaRecorrenteImpl) {
    const entity = despesa.entity;
    entity.dataInicial = entity.dataVencimento;
    entity.dataLancamento = entity.dataPagamento;
    const transacao = new TransacaoImpl(entity);
    transacao.tipoTransacao = TipoTransacao.DEBITO;
    return transacao;
  }

  /**
   * Retorna uma transacao específica da lista de transacoes.
   *
   * @param id - O índice da transacao a ser recuperada.
   * @returns {Observable<TransacaoImpl>} Um Observable que emite a transacao especificada.
   */
  obterTransacao(id: string): Observable<TransacaoImpl> {
    return this._despesaService.obterDespesa(id)
      .pipe(
        map(transacao=>this.converterDespesaEmTransacao(transacao))
      )
    // return this._http.get<ITransacao>(`${environment.apiUrl}/transacao/id/${id}`)
    //   .pipe(
    //     map(item => new TransacaoImpl(item)),
    //     catchError(error => {
    //       throw new Error(error);
    //     })
    //   );
  }

  /**
   * Remove uma transacao específica da lista de transacoes.
   *
   * @param id - O id da transacao a ser removida.
   */
  removerTransacao(id: string) {
    // Remove a transacao específica da lista de transacoes.
    // return this._http.delete<ITransacao>(`${environment.apiUrl}/transacao/id/${id}`);
    return this._despesaService.removerDespesa(id);
  }

  /**
   * Adiciona uma nova transacao à lista de transacoes.
   *
   * @param transacao - O objeto de transacao a ser adicionado.
   * @returns {Observable<TransacaoImpl>} Um Observable que emite a transacao adicionada.
   */
  adicionarTransacao(transacao: TransacaoImpl): Observable<TransacaoImpl> {
    // const request = formatRequestDate(transacao);
    // return this._http.post<ITransacao>(`${environment.apiUrl}/transacao`, request)
    //   .pipe(
    //     map(item => new TransacaoImpl(item)),
    //     catchError(error => {
    //       throw new Error(error);
    //     })
    //   )
    return this._despesaService.adicionarDespesa(new DespesaRecorrenteImpl(transacao))
      .pipe(
        map(transacao=>this.converterDespesaEmTransacao(transacao))
      );
  }

  /**
   * Atualiza uma transacao existente na lista de transacoes.
   *
   * @param transacao - O objeto de transacao a ser atualizado.
   * @returns {Observable<TransacaoImpl>} Um Observable que emite a transacao atualizada.
   */
  atualizarTransacao(transacao: TransacaoImpl): Observable<void> {
    // const request = formatRequestDate(transacao);
    // return this._http.put<void>(`${environment.apiUrl}/transacao`, request)
    //   .pipe(
    //     catchError(error => {
    //       throw new Error(error);
    //     })
    //   )
    return this._despesaService.atualizarDespesa(new DespesaRecorrenteImpl(transacao));
  }

  /**
   * Verifica se a próxima transacao deve ser criada com base na data de vencimento e data de pagamento atuais da transacao atual.
   *
   * @param transacao - A transacao atual a ser analisada.
   */
  gerarNovaTransacao(transacao: TransacaoImpl) {
    if (!!transacao.dataLancamento && (!transacao.dataFinal || getTime(transacao.dataFinal) > getTime(transacao.dataInicial))) {
      let novoVencimento: Date;
      switch (transacao.periodicidade) {
        case Periodicidade.ANUAL: novoVencimento = addYears(transacao.dataInicial, 1); break;
        case Periodicidade.SEMESTRAL: novoVencimento = addMonths(transacao.dataInicial, 6); break;
        case Periodicidade.TRIMESTRAL: novoVencimento = addMonths(transacao.dataInicial, 3); break;
        case Periodicidade.MENSAL: novoVencimento = addMonths(transacao.dataInicial, 1); break;
        case Periodicidade.QUINZENAL: novoVencimento = addDays(transacao.dataInicial, 15); break;
        case Periodicidade.SEMANAL: novoVencimento = addDays(transacao.dataInicial, 7); break;
        default:
          return undefined;
      }
      if (!transacao.dataLancamento || getTime(transacao.dataLancamento) < getTime(novoVencimento)) {
        const novaTransacao = new TransacaoImpl(transacao);
        novaTransacao.dataInicial = novoVencimento;
        novaTransacao._id = undefined;
        novaTransacao.dataLancamento = undefined;
        return novaTransacao;
      }
    }
    return undefined;
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
        this.adicionarTransacao(transacao.entity).subscribe({
          next: entity => {
            observer.next(entity);
            this._alertService.alert({mensagem: 'Transacao cadastrada com sucesso!', titulo: 'Resultado da operação', tipo:'sucesso'});
          },
          error,
          complete: observer.complete
        });
      }
      else {
        this.atualizarTransacao(transacao.entity).subscribe({
          next: () => {
            observer.next(transacao);
            this._alertService.alert({mensagem: 'Transacao atualizada com sucesso!', titulo: 'Resultado da operação', tipo:'sucesso'});
            const proxima = transacao.proxima;
            if (!!proxima && !! transacao.dataLancamento) {
              this.adicionarTransacao(proxima.entity).subscribe((nova)=>{
                observer.next(nova);
                this._alertService.alert({
                  mensagem: 'Transacao gerada com sucesso!', 
                  titulo: 'Resultado da operação', 
                  tipo:'sucesso'});
                observer.complete();
              })
              return;
            }
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
            console.log(`Result ${result}`);
            observer.next(transacao);
          },
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      }, (reason) => {
        console.log(`Dismissed ${reason}`);
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
