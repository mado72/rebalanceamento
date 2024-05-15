import { Component, Input } from '@angular/core';
import { Periodicidade, TipoLiquidacao, TipoTransacao, TransacaoImpl } from '../models/transacao.model';

@Component({
  selector: 'app-transacao-form',
  templateUrl: './transacao-form.component.html',
  styleUrls: ['./transacao-form.component.scss']
})
export class TransacaoFormComponent {
  @Input() transacao = new TransacaoImpl({}); // Preencha com valores iniciais

  readonly DEBITO = TipoTransacao.DEBITO;
  readonly CREDITO = TipoTransacao.CREDITO;
  readonly categorias = {
    DEBITO: ["Custos fixos", "Conforto", "Metas", "Prazeres", "Liberdade Financeira", "Conhecimento","Imposto","Taxa"] ,
    CREDITO: ['Salário', 'Venda', 'Dividendos', 'Juros']
  }

  constructor() {}

  get liquidacoes() {
    // TODO Obter as contas de liquidação
    return [TipoLiquidacao.CONTA, TipoLiquidacao.CARTAO];
  }

  get periodicidades() {
    return Object.values(Periodicidade);
  }

}
