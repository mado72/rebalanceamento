import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DespesaRecorrenteImpl } from '../models/despesa.model';

@Component({
  selector: 'app-cadastro-despesa-modal',
  templateUrl: './cadastro-despesa-modal.component.html',
  styleUrls: ['./cadastro-despesa-modal.component.scss']
})
export class CadastroDespesaModalComponent {

  @Input() titulo = 'Cadastro de Despesa';
  @Input() despesa = new DespesaRecorrenteImpl({});

  @Output() onCancelar = new EventEmitter();
  @Output() onSalvar = new EventEmitter<DespesaRecorrenteImpl>();
  @Output() onExcluir = new EventEmitter<DespesaRecorrenteImpl>();


  salvar() {
    this.onSalvar.emit(this.despesa);
  }

  cancelar() {
    this.onCancelar.emit('Cancelar');
  }

  excluir() {
    this.onExcluir.emit(this.despesa);
  }

  dispensar() {
    this.onCancelar.emit('Dispensar');
  }

}
