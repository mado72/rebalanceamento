import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TransacaoImpl } from '../models/transacao.model';

@Component({
  selector: 'app-transacao-modal',
  templateUrl: './transacao-modal.component.html',
  styleUrls: ['./transacao-modal.component.scss']
})
export class TransacaoModalComponent {

  @Input() titulo = 'Cadastro de Despesa';
  @Input() transacao = new TransacaoImpl({});

  @Output() onCancelar = new EventEmitter();
  @Output() onSalvar = new EventEmitter<TransacaoImpl>();
  @Output() onExcluir = new EventEmitter<TransacaoImpl>();


  salvar() {
    this.onSalvar.emit(this.transacao);
  }

  cancelar() {
    this.onCancelar.emit('Cancelar');
  }

  excluir() {
    this.onExcluir.emit(this.transacao);
  }

  dispensar() {
    this.onCancelar.emit('Dispensar');
  }


}
