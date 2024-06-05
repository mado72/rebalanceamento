import { Component, OnInit } from '@angular/core';
import { CarteiraService } from '../services/carteira.service';
import { CarteiraImpl, ICarteiraAtivo, Moeda, MoedaSigla } from '../model/ativos.model';
import { ContaService } from 'src/app/conta/services/conta.service';
import { Observable, forkJoin } from 'rxjs';

interface IAlocacao {
  carteira: string;
  valor: number;
  planejado: number;
  atual: number;
  moeda?: Moeda;
}
class Alocacao implements IAlocacao {
  id: string;
  carteira: string;
  valor: number;
  planejado: number;
  totalizacao: IAlocacao;
  moeda?: Moeda;

  constructor(id: string, carteira: string, total: number, planejado: number, totalizacao: IAlocacao, moeda?: Moeda) {
    this.id = id;
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

      Promise.resolve().then(() => {
        const mapConsultas = carteiras.reduce((acc, carteira)=>{
          const key = carteira._id as string;
          acc[key] = {
            ob: this._carteiraService.obterAlocacao(carteira),
            carteira
          }
          return acc;
        }, {} as {[key: string]:{ob: Observable<ICarteiraAtivo[]>, carteira: CarteiraImpl}})

        const mapObservables = Object.keys(mapConsultas).reduce((acc, key)=>{
          acc[key] = mapConsultas[key].ob;
          return acc;
        }, {} as {[key: string]: Observable<ICarteiraAtivo[]>});

        forkJoin(mapObservables).subscribe(mapResults=> {
          Object.keys(mapResults).forEach(key=> {
            const carteira = mapConsultas[key].carteira;
            carteira.items = mapResults[key];
            this.total.valor += carteira.total?.vlAtual || 0;
            this.total.planejado += carteira.objetivo;
            this.alocacoes.push(new Alocacao(carteira._id as string, carteira.nome, carteira.total?.vlAtual || 0, carteira.objetivo, this.total, carteira.moeda))
          });

          this.alocacoes.forEach(alocacao => this.total.atual += alocacao.atual);
          
        });
      });

      // this.alocacoes = carteiras.map((carteira: CarteiraImpl) => {
      //   this.total.valor += carteira.total?.vlAtual || 0;
      //   this.total.planejado += carteira.objetivo;
      //   return new Alocacao(carteira._id as string, carteira.nome, carteira.total?.vlAtual || 0, carteira.objetivo, this.total, carteira.moeda)
      // }
      // );

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
