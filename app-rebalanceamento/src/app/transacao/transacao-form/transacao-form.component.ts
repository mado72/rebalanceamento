import { Component, Input, OnInit } from '@angular/core';
import { Periodicidade, TipoLiquidacao, TipoTransacao, TransacaoImpl } from '../models/transacao.model';
import { ContaService } from 'src/app/conta/services/conta.service';
import { Conta, TipoConta } from 'src/app/conta/model/conta.model';

class LiquidacaoItem {
  item!: Conta | TipoLiquidacao;
  tipo!: 'conta' | 'tipo';
  constructor({ item, tipo }: { item: Conta | TipoLiquidacao, tipo: 'conta' | 'tipo' }) {
    this.item = item;
    this.tipo = tipo;
  }
  get asString() : string {
    if (this.tipo === 'conta') {
      const conta = (this.item as Conta);
      return `${conta.conta}`;
    } else {
      return this.item.toString();
    }
  }
}

@Component({
  selector: 'app-transacao-form',
  templateUrl: './transacao-form.component.html',
  styleUrls: ['./transacao-form.component.scss']
})
export class TransacaoFormComponent implements OnInit {

  @Input() transacao = new TransacaoImpl({}); // Preencha com valores iniciais

  readonly DEBITO = TipoTransacao.DEBITO;
  readonly CREDITO = TipoTransacao.CREDITO;
  readonly TRANSFERENCIA = TipoTransacao.TRANSFERENCIA;
  readonly categorias = {
    DEBITO: ["Custos fixos", "Conforto", "Metas", "Prazeres", "Liberdade Financeira", "Conhecimento", "Imposto", "Taxa", "Empréstimo"],
    CREDITO: ['Salário', 'Venda', 'Dividendos', 'Juros', 'Empréstimo'],
    TRANSFERENCIA: ['Transferência']
  }

  contas: Conta[] = [];

  opcaoLiquidacaoTipoConta = new LiquidacaoItem({ item: TipoLiquidacao.CORRENTE, tipo: 'tipo' });
  opcaoLiquidacaoTipoCartao = new LiquidacaoItem({ item: TipoLiquidacao.CARTAO, tipo: 'tipo' });
  opcoesLiquidacaoConta: LiquidacaoItem[] = [];
  opcoesLiquidacaoCartao: LiquidacaoItem[] = [];

  private _liquidacao?: LiquidacaoItem;

  constructor(private _contaService: ContaService) { }

  ngOnInit(): void {

    this._contaService.listarContas().subscribe(contas => {
      this.contas = contas.sort((a, b) => {
        return 1000 * a.tipo.localeCompare(b.tipo) + a.conta.localeCompare(b.conta);
      });

      this.opcoesLiquidacaoConta = (this.contas.filter(c => c.tipo == TipoConta.CORRENTE).map(c => new LiquidacaoItem({ item: c, tipo: 'conta' })));
      this.opcoesLiquidacaoCartao = (this.contas.filter(c => c.tipo == TipoConta.CARTAO).map(c => new LiquidacaoItem({ item: c, tipo: 'conta' })));

      if (!!this.transacao.contaLiquidacao) {
        const contaLiquidacao = this.contas.find(c=> c._id === this.transacao.contaLiquidacao);
        this._liquidacao = new LiquidacaoItem({ item: contaLiquidacao || TipoLiquidacao.CORRENTE, tipo: 'conta' });
      }
      else {
        this._liquidacao = new LiquidacaoItem({ item: this.transacao.liquidacao, tipo: 'tipo' });
      }
    });
  }

  get periodicidades() {
    return Object.values(Periodicidade);
  }

  get liquidacao() {
    return this._liquidacao;
  }

  set liquidacao(valor: LiquidacaoItem | undefined) {
    this._liquidacao = valor;
    if (!!valor) {
      if (valor.tipo === 'conta') {
        const conta = valor.item as Conta;
        this.transacao.contaLiquidacao = conta._id;
        this.transacao.liquidacao = conta.tipo == TipoConta.CORRENTE ? TipoLiquidacao.CORRENTE : TipoLiquidacao.CARTAO;
      } else {
        this.transacao.contaLiquidacao = undefined;
        this.transacao.liquidacao = valor.item as TipoLiquidacao;
      }
    }
  }
 
  equals<T extends LiquidacaoItem>(a: T | undefined, b: T | undefined): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.tipo!== b.tipo) return false;
    if (a.tipo === 'conta') return (a.item as Conta)._id === (b.item as Conta)._id;
    return a.item === b.item;
  }

}
