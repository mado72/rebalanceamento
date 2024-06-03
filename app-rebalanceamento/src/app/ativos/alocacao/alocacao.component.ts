import { Component, OnInit } from '@angular/core';
import { CarteiraService } from '../services/carteira.service';
import { CarteiraImpl, Moeda, MoedaSigla } from '../model/ativos.model';
import { ContaService } from 'src/app/conta/services/conta.service';

interface IAlocacao {
  carteira: string;
  valor: number;
  planejado: number;
  atual: number;
  moeda?: Moeda;
}
class Alocacao implements IAlocacao {
  carteira!: string;
  valor!: number;
  planejado!: number;
  totalizacao!: IAlocacao;
  moeda?: Moeda;

  constructor(carteira: string, total: number, planejado: number, totalizacao: IAlocacao, moeda?: Moeda) {
    this.carteira = carteira;
    this.valor = total;
    this.planejado = planejado;
    this.totalizacao = totalizacao;
    this.moeda = moeda;
  }

  get atual(): number {
    return this.valor / this.totalizacao.valor;
  }
}

@Component({
  selector: 'app-alocacao',
  templateUrl: './alocacao.component.html',
  styleUrls: ['./alocacao.component.scss']
})
export class AlocacaoComponent implements OnInit {

  alocacoes: IAlocacao[] = [];
  total!: IAlocacao;

  constructor(
    private _contaService: ContaService,
    private _carteiraService: CarteiraService
  ) { }

  ngOnInit(): void {
    this._carteiraService.obterCarteiras().subscribe(carteiras => {
      this.total = {
        carteira: 'Total',
        valor: 0,
        planejado: 0,
        atual: 0
      }

      this.alocacoes = carteiras.map((carteira: CarteiraImpl) => {
        this.total.valor += carteira.total.vlAtual || 0;
        this.total.planejado += carteira.objetivo;
        return new Alocacao(carteira.nome, carteira.total.vlAtual || 0, carteira.objetivo, this.total, carteira.moeda)
      }
      );

      this.alocacoes.forEach(alocacao => this.total.atual += alocacao.atual);
    })
  }

  siglaMoeda(alocacao: IAlocacao) {
    if (alocacao.moeda) {
      return MoedaSigla[alocacao.moeda];
    } else {
      return 'R$';
    }
  }
}
