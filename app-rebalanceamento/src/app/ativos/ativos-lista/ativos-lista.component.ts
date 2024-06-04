import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AtivoImpl, Moeda, MoedaSigla, TipoAtivo } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';
import { AtivoModalComponent } from '../ativo-modal/ativo-modal.component';

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
    this.obterAtivos();
  }

  private obterAtivos() {
    this._carteiraService.obterTodosAtivos().subscribe(ativos => {
      this._ativosDisponiveis = ativos;
      this.filtrar();
    });
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
    const modalRef = this._modalService.open(AtivoModalComponent, { size: 'lg' });
    const component = modalRef.componentInstance as AtivoModalComponent;

    component.onClose.subscribe(()=>modalRef.dismiss('fechar'));
    component.onSave.subscribe(()=>modalRef.close('salvar'));
    component.ativo = ativo;

    modalRef.result.then(
      (result)=>{
        if(result ==='salvar') {
          this._carteiraService.salvarAtivo(ativo).subscribe(()=>{
            this._alertService.alert({
              titulo: 'Resultado da operação',
              mensagem: 'Ativo salvo com sucesso',
              tipo: 'sucesso'
            });
            this.obterAtivos();
          })
        }
      }, 
      (reason)=>{
        modalRef.dismiss();
      })
  }

}
