import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarteiraItem, Moeda, MoedaSigla, TipoAtivo } from '../model/ativos.model';

@Component({
  selector: 'app-carteira-item-form',
  templateUrl: './carteira-item-form.component.html',
  styleUrls: ['./carteira-item-form.component.scss']
})
export class CarteiraItemFormComponent {

  @Input() carteiraItem: CarteiraItem;

  @Output() salvo = new EventEmitter<CarteiraItem>();

  @Output() excluido = new EventEmitter<CarteiraItem>();

  @Output() cancelado = new EventEmitter()

  constructor() {
    this.carteiraItem = {
      ativo: {
        sigla: "",
        qtd: 0,
        vlUnitario: 0,
        vlInicial: 0,
        valor: 0
      },
      objetivo: 0,
    };
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.salvo.emit(this.carteiraItem);
  }

  onCancelar(): void {
    this.cancelado.emit();
  }

  onExcluir(): void {
    this.excluido.emit(this.carteiraItem);
  }

  get tipos(): string[] {
    return Object.values(TipoAtivo);
  }

  get moedas(): string[] {
    return Object.keys(Moeda);
  }

  sigla(moedaString: string) : any {
    const moeda = Object.values(Moeda).find(m => "" + m === moedaString);
    if (!moeda) return null;
    return MoedaSigla[moeda];
  }

}
