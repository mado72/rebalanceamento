import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecebimentoImpl } from '../models/recebimento.model';

@Component({
  selector: 'app-cadastro-recebimento-modal',
  templateUrl: './cadastro-recebimento-modal.component.html',
  styleUrls: ['./cadastro-recebimento-modal.component.scss']
})
export class CadastroRecebimentoModalComponent {
  @Input() titulo = 'Cadastro de Recebimento';
  @Input() recebimento = new RecebimentoImpl({});

  @Output() onCancelar = new EventEmitter();
  @Output() onSalvar = new EventEmitter<RecebimentoImpl>();
  @Output() onExcluir = new EventEmitter<RecebimentoImpl>();


  salvar() {
    this.onSalvar.emit(this.recebimento);
  }

  cancelar() {
    this.onCancelar.emit('Cancelar');
  }

  excluir() {
    this.onExcluir.emit(this.recebimento);
  }

  dispensar() {
    this.onCancelar.emit('Dispensar');
  }

}
