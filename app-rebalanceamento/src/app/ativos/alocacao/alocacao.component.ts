import { Component, OnInit } from '@angular/core';
import { CarteiraService } from '../services/carteira.service';
import { CarteiraImpl, ICarteiraAtivo, Moeda, MoedaSigla } from '../model/ativos.model';
import { ContaService } from 'src/app/conta/services/conta.service';
import { Observable, forkJoin } from 'rxjs';
import { CacheService } from 'src/app/util/services/cache.service';

interface IAlocacao extends Omit<Alocacao, "totalizacao"> {
};

interface Total extends IAlocacao {
  atual: number;
}

class Alocacao  {
  id?: string;
  carteira: string;
  valor: number;
  valorReal?: number;
  planejado: number;
  totalizacao: Total;
  moeda?: Moeda;
  tipo: string;

  constructor(id: string, tipo: string, carteira: string, total: number, planejado: number, totalizacao: Total, moeda?: Moeda) {
    this.id = id;
    this.tipo = tipo;
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
  total!: Total;
  private _expanded: boolean = true;
  public get expanded(): boolean {
    return this._expanded;
  }
  public set expanded(value: boolean) {
    this._expanded = value;
    this.obterAlocacoes();
  }

  constructor(
    private _carteiraService: CarteiraService,
    private _cacheService: CacheService
  ) { }

  ngOnInit(): void {
    this.obterAlocacoes();
  }

  private obterAlocacoes() {
    this.alocacoes = [];
    this._carteiraService.obterCarteiras().subscribe(carteiras => {

      carteiras.sort((a, b) => a.nome.localeCompare(b.nome));
      this.total = {
        id: 'total',
        tipo: '',
        carteira: 'Total',
        valor: 0,
        planejado: 0,
        atual: 0
      };

      Promise.resolve().then(() => {
        
        const mapConsultas = carteiras.reduce((acc, carteira) => {
          const key = carteira._id as string;
          acc[key] = {
            ob: this._carteiraService.obterAlocacao(carteira),
            carteira
          };
          return acc;
        }, {} as { [key: string]: { ob: Observable<ICarteiraAtivo[]>; carteira: CarteiraImpl; }; });
        
        const mapObservables = Object.keys(mapConsultas).reduce((acc, key) => {
          acc[key] = mapConsultas[key].ob;
          return acc;
        }, {} as { [key: string]: Observable<ICarteiraAtivo[]>; });
        
        forkJoin(mapObservables).subscribe(mapResults => {
          const cotacaoMoedas = this._cacheService.get('cotacoesMoedas');

          Object.keys(mapResults).forEach(key => {
            const carteira = mapConsultas[key].carteira;

            if (carteira.objetivo > 0) {
              carteira.items = mapResults[key];
              carteira.calculaTotais(cotacaoMoedas);
              this.total.valor += carteira.total?.vlMoeda || 0;
              this.total.planejado += carteira.objetivo;
              const valor = carteira.total.vlMoeda || carteira.total.vlAtual || 0;
              this.alocacoes.push(new Alocacao(carteira._id as string, 
                carteira.classe, carteira.nome, valor, carteira.objetivo, this.total, carteira.moeda));
            }
          });

          this.alocacoes.forEach(alocacao => this.total.atual += alocacao.atual);

          if (!this.expanded) {
            const aux = this.alocacoes.reduce((acc, alocacao)=>{
              const key = `${alocacao.tipo}-${alocacao.moeda}`;
              let accAloc = acc.get(key);
              if (!accAloc) {
                accAloc = alocacao;
                acc.set(key, accAloc);
              }
              else {
                accAloc.valor += alocacao.valor;
                accAloc.planejado += alocacao.planejado;
              }
              return acc;
            }, new Map<string, IAlocacao>());

            this.alocacoes = Array.from(aux.values());
          }
        });
      });
    });
  }

  siglaMoeda(alocacao: IAlocacao) {
    if (alocacao.moeda) {
      return alocacao.moeda;
    } else {
      return 'R$';
    }
  }

  diferencaPerc(alocacao: IAlocacao) {
    return (alocacao.atual - alocacao.planejado) / alocacao.planejado;
  }

  editarCarteira(carteiraId: string) {
    this._carteiraService.obterCarteira(carteiraId).subscribe(carteira=>{
      if (!!carteira) {
        this._carteiraService.editarCarteira(carteira).subscribe(result=>{
          if (!!result) {
            this.obterAlocacoes();
          }
        });
      }
    })
  }
}
