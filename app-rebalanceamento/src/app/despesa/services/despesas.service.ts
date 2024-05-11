import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTime } from 'luxon';
import { Observable, Observer, catchError, filter, map, mergeAll, of, tap } from 'rxjs';
import { DespesaRecorrenteImpl, IDespesaRecorrente, Mes, Periodicidade, TipoLiquidacao } from 'src/app/despesa/models/despesa.model';
import { AlertService } from 'src/app/services/alert.service';
import { formatRequestDate } from 'src/app/util/date-formatter.util';
import { environment } from 'src/environments/environment.development';
import { CadastroDespesaModalComponent } from '../cadastro-despesa-modal/cadastro-despesa-modal.component';
import { addDays, addMonths, addYears, getDay, getMonth, getTime, getYear, setMonth, setYear } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DespesasService {

  constructor(
    private _http: HttpClient,
    private _alertService: AlertService,
    private _modalService: NgbModal
  ) { }

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
    return this._http.get<IDespesaRecorrente[]>(`${environment.apiUrl}/despesa`)
      .pipe(
        map(result => {
          return result.map(item => new DespesaRecorrenteImpl(item))
        }),
        catchError(error => {
          throw new Error(JSON.stringify(error));
        })
      )
  }

  obterDespesasParaAno(ano: number): Observable<DespesaRecorrenteImpl[]> {
    const inicioData = DateTime.now().set({ year: ano }).startOf('year');
    const ateData = inicioData.endOf("year");

    return this.obterDespesas().pipe(
      map(despesas => {
        return despesas.filter(despesa => {
          return !despesa.dataVencimento || DateTime.fromJSDate(despesa.dataVencimento) > inicioData;
        });
      }),
      mergeAll(),
      map(despesa => {
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
    return this._http.get<IDespesaRecorrente>(`${environment.apiUrl}/despesa/id/${id}`)
      .pipe(
        map(item => new DespesaRecorrenteImpl(item)),
        catchError(error => {
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
    return this._http.delete<IDespesaRecorrente>(`${environment.apiUrl}/despesa/id/${id}`);
  }

  /**
   * Adiciona uma nova despesa à lista de despesas.
   *
   * @param despesa - O objeto de despesa a ser adicionado.
   * @returns {Observable<DespesaRecorrenteImpl>} Um Observable que emite a despesa adicionada.
   */
  adicionarDespesa(despesa: DespesaRecorrenteImpl): Observable<DespesaRecorrenteImpl> {
    const request = formatRequestDate(despesa);
    return this._http.post<IDespesaRecorrente>(`${environment.apiUrl}/despesa`, request)
      .pipe(
        map(item => new DespesaRecorrenteImpl(item)),
        catchError(error => {
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
    return this._http.put<void>(`${environment.apiUrl}/despesa`, request)
      .pipe(
        catchError(error => {
          throw new Error(error);
        })
      )
  }

  /**
   * Verifica se a próxima despesa deve ser criada com base na data de vencimento e data de pagamento atuais da despesa atual.
   *
   * @param despesa - A despesa atual a ser analisada.
   * @param observer - O observador a ser notificado quando a próxima despesa deve ser criada.
   */
  checkNextDespesa(despesa: DespesaRecorrenteImpl, observer: Observer<DespesaRecorrenteImpl>) {
    if (!!despesa.dataPagamento && (!despesa.dataFinal || getTime(despesa.dataFinal) > getTime(despesa.dataVencimento))) {
      let novoVencimento: Date;
      switch (despesa.periodicidade) {
        case Periodicidade.ANUAL: novoVencimento = addYears(despesa.dataVencimento, 1); break;
        case Periodicidade.SEMESTRAL: novoVencimento = addMonths(despesa.dataVencimento, 6); break;
        case Periodicidade.TRIMESTRAL: novoVencimento = addMonths(despesa.dataVencimento, 3); break;
        case Periodicidade.MENSAL: novoVencimento = addMonths(despesa.dataVencimento, 1); break;
        case Periodicidade.QUINZENAL: novoVencimento = addDays(despesa.dataVencimento, 15); break;
        case Periodicidade.SEMANAL: novoVencimento = addDays(despesa.dataVencimento, 7); break;
        default:
          return;
      }
      if (!despesa.dataFinal || getTime(despesa.dataFinal) < getTime(novoVencimento)) {
        const novaDespesa = new DespesaRecorrenteImpl(despesa);
        novaDespesa.dataVencimento = novoVencimento;
        novaDespesa.dataPagamento = undefined;
        observer.next(novaDespesa);
      }
    }
  }

  /**
   * Salva uma despesa.
   *
   * @param despesa - A despesa a ser salva.
   * @returns Um Observable que emite a despesa salva.
   */
  salvarDespesa(despesa: DespesaRecorrenteImpl): Observable<DespesaRecorrenteImpl> {
    const obDespesa = new Observable<DespesaRecorrenteImpl>((observer: Observer<DespesaRecorrenteImpl>) => {

      const error = (error: any) => {
        observer.error(error);
        this._alertService.alert({
          mensagem: `Erro ao atualizar despesa.${error.message ? '<br>\n<b>Origem:</b>' + error.message : ''}`,
          titulo: 'Resultado da operação',
          tipo: 'erro'
        });
      };

      const next = (despesa: DespesaRecorrenteImpl, mensagem: string) => {
        observer.next(despesa);
        this.checkNextDespesa(despesa, observer);
        this._alertService.alert({mensagem, titulo: 'Resultado da operação', tipo: 'sucesso'});
      }

      if (!despesa._id) {
        this.adicionarDespesa(despesa).subscribe({
          next: despesa => next(despesa, 'Despesa cadastrada com sucesso!'),
          error,
          complete: () => observer.complete()
        });
      }
      else {
        this.atualizarDespesa(despesa).subscribe({
          next: () => next(despesa, 'Despesa atualizada com sucesso!'),
          error,
          complete: () => observer.complete()
        });
      }
    });

    return obDespesa;
  }

  /**
   * Abre uma janela de formulário para editar ou criar uma nova despesa.
   *
   * @param despesa - O objeto da despesa a ser editada ou criada.
   * @param titulo - O título da janela de formulário.
   * @returns Um Observable que emite a despesa editada ou criada.
   */
  abrirDespesaForm(despesa: DespesaRecorrenteImpl, titulo: string) {
    const ob = new Observable<DespesaRecorrenteImpl>((observer: Observer<DespesaRecorrenteImpl>) => {
      const modalRef = this._modalService.open(CadastroDespesaModalComponent, { size: 'lg' });
      const component = modalRef.componentInstance as CadastroDespesaModalComponent;
      component.despesa = despesa;
      component.titulo = titulo;

      component.onCancelar.subscribe((ev: any) => {
        modalRef.dismiss(ev);
        observer.complete();
      });

      component.onSalvar.subscribe((ev: any) => modalRef.close('Salvar'));

      component.onExcluir.subscribe((ev: any) => modalRef.dismiss('Excluir'));

      modalRef.result.then((result) => {
        this.salvarDespesa(despesa).subscribe({
          next: () => {
            console.log(`Result ${result}`);
            observer.next(despesa);
          },
          error: (error) => observer.error(error),
          complete: () => observer.complete()
        });
      }, (reason) => {
        console.log(`Dismissed ${reason}`);
        if (reason === 'Excluir') {
          if (!despesa._id) return;
          if (confirm(`Excluir despesa ${despesa.descricao}`)) {
            this.removerDespesa(despesa._id).subscribe({
              next: () => {
                observer.next(despesa);
                this._alertService.alert({
                  mensagem: `Despesa ${despesa.descricao} excluída`,
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
