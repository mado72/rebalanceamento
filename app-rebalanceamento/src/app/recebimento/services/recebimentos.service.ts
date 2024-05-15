import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Observer, catchError, map } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { IRecebimento, RecebimentoImpl as RecebimentoImpl } from '../models/recebimento.model';
import { environment } from 'src/environments/environment.development';
import { formatRequestDate } from 'src/app/util/date-formatter.util';
import { addDays, addMonths, addYears, getTime } from 'date-fns';
import { CadastroRecebimentoModalComponent } from '../cadastro-recebimento-modal/cadastro-recebimento-modal.component';
import { Periodicidade } from 'src/app/transacao/models/transacao.model';

@Injectable({
  providedIn: 'root'
})
export class RecebimentosService {

  constructor(
    private _http: HttpClient,
    private _alertService: AlertService,
    private _modalService: NgbModal
  ) { }

  /**
   * Retorna um Observable que emite o array de todos os recebimentos.
   *
   * @returns {Observable<RecebimentoImpl[]>} Um Observable que emite o array de todos os recebimentos.
   */
  obterRecebimentos(): Observable<RecebimentoImpl[]> {
    return this._http.get<IRecebimento[]>(`${environment.apiUrl}/recebimento`)
      .pipe(
        map(result => {
          return result.map(item => new RecebimentoImpl(item))
        }),
        catchError(error => {
          throw new Error(JSON.stringify(error));
        })
      )
  }

  /**
   * Retorna um recebimento específica da lista de recebimentos.
   *
   * @param id - O índice de recebimento a ser recuperado.
   * @returns {Observable<RecebimentoImpl>} Um Observable que emite  recebimento especificado.
   */
  obterRecebimento(id: string): Observable<RecebimentoImpl> {
    return this._http.get<IRecebimento>(`${environment.apiUrl}/recebimento/id/${id}`)
      .pipe(
        map(item => new RecebimentoImpl(item)),
        catchError(error => {
          throw new Error(error);
        })
      );
  }

  /**
   * Remove um recebimento específica da lista de recebimentos.
   *
   * @param id - O id do recebimento a ser removido.
   */
  removerRecebimento(id: string) {
    // Remove recebimento específica da lista de recebimentos.
    return this._http.delete<IRecebimento>(`${environment.apiUrl}/recebimento/id/${id}`);
  }

  /**
   * Adiciona um recebimento à lista de recebimentos.
   *
   * @param recebimento - O objeto de recebimento a ser adicionado.
   * @returns {Observable<RecebimentoImpl>} Um Observable que emite recebimento adicionado.
   */
  adicionarRecebimento(recebimento: RecebimentoImpl): Observable<RecebimentoImpl> {
    const request = formatRequestDate(recebimento);
    return this._http.post<IRecebimento>(`${environment.apiUrl}/recebimento`, request)
      .pipe(
        map(item => new RecebimentoImpl(item)),
        catchError(error => {
          throw new Error(error);
        })
      )
  }

  /**
   * Atualiza um recebimento existente na lista de recebimentos.
   *
   * @param recebimento - O objeto de recebimento a ser atualizado.
   * @returns {Observable<RecebimentoImpl>} Um Observable que emite recebimento atualizada.
   */
  atualizarRecebimento(recebimento: RecebimentoImpl): Observable<void> {
    const request = formatRequestDate(recebimento);
    return this._http.put<void>(`${environment.apiUrl}/recebimento`, request)
      .pipe(
        catchError(error => {
          throw new Error(error);
        })
      )
  }

  /**
   * Verifica se a próxim recebimento deve ser criada com base na data de vencimento e data de pagamento atuais do recebimento atual.
   *
   * @param recebimento - A recebimento atual a ser analisada.
   */
  gerarNovaRecebimento(recebimento: RecebimentoImpl) {
    if (!!recebimento.dataPagamento && (!recebimento.dataFinal || getTime(recebimento.dataFinal) > getTime(recebimento.dataInicial))) {
      let novoInicial: Date;
      switch (recebimento.periodicidade) {
        case Periodicidade.ANUAL: novoInicial = addYears(recebimento.dataInicial, 1); break;
        case Periodicidade.SEMESTRAL: novoInicial = addMonths(recebimento.dataInicial, 6); break;
        case Periodicidade.TRIMESTRAL: novoInicial = addMonths(recebimento.dataInicial, 3); break;
        case Periodicidade.MENSAL: novoInicial = addMonths(recebimento.dataInicial, 1); break;
        case Periodicidade.QUINZENAL: novoInicial = addDays(recebimento.dataInicial, 15); break;
        case Periodicidade.SEMANAL: novoInicial = addDays(recebimento.dataInicial, 7); break;
        default:
          return undefined;
      }
      if (!recebimento.dataPagamento || getTime(recebimento.dataPagamento) < getTime(novoInicial)) {
        const novaRecebimento = new RecebimentoImpl(recebimento);
        novaRecebimento.dataInicial = novoInicial;
        novaRecebimento._id = undefined;
        novaRecebimento.dataPagamento = undefined;
        return novaRecebimento;
      }
    }
    return undefined;
  }

  /**
   * Salva um recebimento.
   *
   * @param recebimento - A recebimento a ser salva.
   * @returns Um Observable que emite  recebimento salva.
   */
  salvarRecebimento(recebimento: RecebimentoImpl): Observable<RecebimentoImpl> {
    const obRecebimento = new Observable<RecebimentoImpl>((observer: Observer<RecebimentoImpl>) => {

      const error = (error: any) => {
        observer.error(error);
        this._alertService.alert({
          mensagem: `Erro ao atualizar recebimento.${error.message ? '<br>\n<b>Origem:</b>' + error.message : ''}`,
          titulo: 'Resultado da operação',
          tipo: 'erro'
        });
      };

      const next = (recebimento: RecebimentoImpl, mensagem: string) => {
        observer.next(recebimento);
        this._alertService.alert({mensagem, titulo: 'Resultado da operação', tipo: 'sucesso'});
      }

      const complete = (novaRecebimento: RecebimentoImpl | undefined, observer: Observer<RecebimentoImpl>) => {
        if (!!novaRecebimento) {
          this.adicionarRecebimento(novaRecebimento).subscribe({
            next: (recebimento)=> {
              observer.next(recebimento); 
              this._alertService.alert({mensagem: 'Recebimento gerado com sucesso!', titulo: 'Resultado da operação', tipo: 'sucesso'})
            },
            error,
            complete: () => observer.complete()
          });
        }
        else {
          observer.complete();
        }
      }

      const novaRecebimento = this.gerarNovaRecebimento(recebimento);
      
      let entity = Object.assign({}, recebimento) as any;
      if (entity.dataFinal === undefined) entity.dataFinal = null;
      if (entity.dataInicial === undefined) entity.dataInicial = null;
      if (entity.dataPagamento === undefined) {
        entity.dataPagamento = null;
      }
      else {
        entity.dataFinal = entity.dataPagamento;
      }

      if (!entity._id) {
        this.adicionarRecebimento(entity).subscribe({
          next: entity => next(entity, 'Recebimento cadastrado com sucesso!'),
          error,
          complete: ()=>complete(novaRecebimento, observer)
        });
      }
      else {
        this.atualizarRecebimento(entity).subscribe({
          next: () => next(entity, 'Recebimento atualizado com sucesso!'),
          error,
          complete: ()=>complete(novaRecebimento, observer)
        });
      }
    });

    return obRecebimento;
  }

  /**
   * Abre uma janela de formulário para editar ou criar uma nov recebimento.
   *
   * @param recebimento - O objeto do recebimento a ser editada ou criada.
   * @param titulo - O título da janela de formulário.
   * @returns Um Observable que emite  recebimento editada ou criada.
   */
  abrirRecebimentoForm(recebimento: RecebimentoImpl, titulo: string) {
    const ob = new Observable<RecebimentoImpl>((observer: Observer<RecebimentoImpl>) => {
      const modalRef = this._modalService.open(CadastroRecebimentoModalComponent, { size: 'lg' });
      const component = modalRef.componentInstance as CadastroRecebimentoModalComponent;
      component.recebimento = recebimento;
      component.titulo = titulo;

      component.onCancelar.subscribe((ev: any) => {
        modalRef.dismiss(ev);
        observer.complete();
      });

      component.onSalvar.subscribe((ev: any) => modalRef.close('Salvar'));

      component.onExcluir.subscribe((ev: any) => modalRef.dismiss('Excluir'));

      modalRef.result.then((result) => {
        this.salvarRecebimento(recebimento).subscribe({
          next: () => {
            console.log(`Result ${result}`);
            observer.next(recebimento);
          },
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      }, (reason) => {
        console.log(`Dismissed ${reason}`);
        if (reason === 'Excluir') {
          if (!recebimento._id) return;
          if (confirm(`Excluir recebimento ${recebimento.descricao}`)) {
            this.removerRecebimento(recebimento._id).subscribe({
              next: () => {
                observer.next(recebimento);
                this._alertService.alert({
                  mensagem: `Recebimento ${recebimento.descricao} excluído`,
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
