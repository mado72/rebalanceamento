import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AtivoImpl, Moeda, MoedaSigla, TipoAtivo } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';

interface Filtro {
  moeda?: Moeda,
  tipoAtivo?: TipoAtivo
}
@Component({
  selector: 'app-ativos-lista',
  templateUrl: './ativos-lista.component.html',
  styleUrls: ['./ativos-lista.component.scss']
})
export class AtivosListaComponent implements OnInit {

  constructor(
    private _carteiraService: CarteiraService,
    private _modalService: NgbModal,
    private _alertService: AlertService
  ) { }

  private _ativosDisponiveis: AtivoImpl[] = [];

  ativos: AtivoImpl[] = [];

  filtro: Filtro = {}

  readonly moedas = Object.values(Moeda);

  readonly tiposAtivo = Object.values(TipoAtivo);

  ngOnInit(): void {
    this._carteiraService.obterTodosAtivos().subscribe(ativos=> {
      this._ativosDisponiveis = ativos;
      this.filtrar();
    })
  }

  get ativosDisponiveis() {
    return this._ativosDisponiveis;
  }

  filtrar() {
    this.ativos = this._ativosDisponiveis.filter(ativo => {
      return (!this.filtro.moeda || this.filtro.moeda === ativo.moeda)
        && (!this.filtro.tipoAtivo || this.filtro.tipoAtivo === ativo.tipoAtivo)
    });
  }

  filtrarTipoAtivo(tipoAtivo: TipoAtivo) {
    this.filtro.tipoAtivo = this.filtro.tipoAtivo === tipoAtivo ? undefined : tipoAtivo;
    this.filtrar();
  }

  filtrarMoeda(moeda: Moeda) {
    this.filtro.moeda = this.filtro.moeda === moeda ? undefined : moeda;
    this.filtrar();
  }

  siglaMoeda(moeda: Moeda): string {
    return MoedaSigla[moeda];
  }

  editarAtivo(ativo: AtivoImpl) {
    throw new Error('Method not implemented.');
  }

}
