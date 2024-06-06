import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AlocacaoComponent } from './alocacao/alocacao.component';
import { AtivosRoutingModule } from './ativos-routing.module';
import { CarteiraAtivoFormComponent } from './carteira-ativo-form/carteira-ativo-form.component';
import { CarteiraAtivoComponent } from './carteira-ativo/carteira-ativo.component';
import { CarteiraFormComponent } from './carteira-form/carteira-form.component';
import { CarteiraListaAtivosComponent } from './carteira-lista-ativos/carteira-lista-ativos.component';
import { CarteiraPortifolioComponent } from './carteira-portifolio/carteira-portifolio.component';
import { AtivosListaComponent } from './ativos-lista/ativos-lista.component';
import { AtivoModalComponent } from './ativo-modal/ativo-modal.component';
import { UtilModule } from '../util/util.module';
import { AtivoBuscaComponent } from './ativo-busca/ativo-busca.component';
import { NegativoDirective } from '../util/negativo.directive';


@NgModule({
  declarations: [
    CarteiraPortifolioComponent,
    CarteiraAtivoComponent,
    CarteiraAtivoFormComponent,
    CarteiraListaAtivosComponent,
    CarteiraFormComponent,
    AlocacaoComponent,
    AtivosListaComponent,
    AtivoModalComponent,
    AtivoBuscaComponent
  ],
  imports: [
    CommonModule,
    NgbTypeaheadModule,
    NgbDropdownModule,
    FormsModule,
    UtilModule,
    AtivosRoutingModule,
    NegativoDirective
  ],
  exports: [
    CarteiraPortifolioComponent
  ]
})
export class AtivosModule { }
