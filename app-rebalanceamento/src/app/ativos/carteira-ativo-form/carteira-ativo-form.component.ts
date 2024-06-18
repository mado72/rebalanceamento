import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IAtivo, ICarteiraAtivo, Moeda } from '../model/ativos.model';
import { Observable, OperatorFunction, catchError, debounceTime, delay, distinctUntilChanged, from, map, of, skipUntil, skipWhile, switchMap, tap, timer } from 'rxjs';

@Component({
  selector: 'app-carteira-ativo-form',
  templateUrl: './carteira-ativo-form.component.html',
  styleUrls: ['./carteira-ativo-form.component.scss']
})
/**
 * @description
 * Componente para lidar com o formulário de um item da carteira.
 *
 * @class CarteiraAtivoFormComponent
 */
export class CarteiraAtivoFormComponent {

  @Input() ativos: IAtivo[] = [];

  @Output() onTermoChanged = new EventEmitter<string>();

  /**
   * @description
   * Propriedade de entrada que recebe os dados iniciais do item da carteira.
   *
   * @type {ICarteiraAtivo}
   * @memberof CarteiraAtivoFormComponent
   */
  _carteiraAtivo!: ICarteiraAtivo;

  get carteiraAtivo(): ICarteiraAtivo {
    return this._carteiraAtivo;
  }

  @Input()
  set carteiraAtivo(value: ICarteiraAtivo) {
    this._carteiraAtivo = Object.assign({} as ICarteiraAtivo, value);
  }

  /**
   * @description
   * EventEmitter que emite os dados do item da carteira salvo.
   *
   * @type {EventEmitter<ICarteiraAtivo>}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() onSalvar = new EventEmitter<ICarteiraAtivo>();

  /**
   * @description
   * EventEmitter que emite os dados do item da carteira excluído.
   *
   * @type {EventEmitter<ICarteiraAtivo>}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() onExcluir = new EventEmitter<ICarteiraAtivo>();

  /**
   * @description
   * EventEmitter que emite a operação cancelada.
   *
   * @type {EventEmitter}
   * @memberof CarteiraAtivoFormComponent
   */
  @Output() onCancelar = new EventEmitter();

  /**
   * @description
   * Construtor que inicializa o componente com um objeto de item da carteira vazio.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  constructor() {
    this.carteiraAtivo = {
      ativo: {
        sigla: "",
        nome: "",
        moeda: Moeda.BRL
      },
      quantidade: 0,
      vlAtual: 0,
      vlInicial: 0,
      objetivo: 0,
    };
  }

  buscando = false;
  buscaFalhou = false;

  buscarAtivo: OperatorFunction<string, readonly IAtivo[]> = ($text: Observable<string>) => 
    $text.pipe(
      skipWhile((termo)=>termo.length < 3),
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.buscando = true),

      switchMap((termo)=>of(termo)
        .pipe(
          tap((termo) => {
            this.buscaFalhou = false;
            this.onTermoChanged.emit(termo);
          }),
          delay(200),
          // map(_=>this.ativos.map(ativo=>ativo.nome)),
          map(_=>this.ativos),
          catchError(()=>{
            this.buscando = false;
            this.buscaFalhou = true;
            return of([]);
          }),
          tap(()=>this.buscando = false)
        ))
    )

  formatar = (value: any) => value._id? value.nome : value;

  selecionarAtivo(event: any) {
    this._carteiraAtivo.ativo = event.item as IAtivo;
    this._carteiraAtivo.ativoId = this._carteiraAtivo.ativo._id;
    return event;
  }

  get objetivoPerc() {
    return this.carteiraAtivo.objetivo * 100;
  }

  set objetivoPerc(value: number) {
    this.carteiraAtivo.objetivo = value * 0.01;
  }

  /**
   * @description
   * Método que emite os dados do item da carteira salvo quando o formulário é enviado.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  submitClick(): void {
    // TODO Anexar ativo à carteira, considerando os ativos pesquisados na digitação.
    this.onSalvar.emit(this.carteiraAtivo);
  }

  /**
   * @description
   * Método que emite a operação cancelada quando o formulário é cancelado.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  cancelarClick(): void {
    this.onCancelar.emit();
  }

  /**
   * @description
   * Método que emite os dados do item da carteira excluído quando o formulário é excluído.
   *
   * @memberof CarteiraAtivoFormComponent
   */
  excluirClick(): void {
    this.onExcluir.emit(this.carteiraAtivo);
  }

}