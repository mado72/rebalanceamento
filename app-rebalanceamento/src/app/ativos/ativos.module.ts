import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AlocacaoComponent } from './alocacao/alocacao.component';
import { AtivosRoutingModule } from './ativos-routing.module';
import { CarteiraAtivoFormComponent } from './carteira-ativo-form/carteira-ativo-form.component';
import { CarteiraAtivoComponent } from './carteira-ativo/carteira-ativo.component';
import { CarteiraFormComponent } from './carteira-form/carteira-form.component';
import { CarteiraListaAtivosComponent } from './carteira-lista-ativos/carteira-lista-ativos.component';
import { CarteiraPortifolioComponent } from './carteira-portifolio/carteira-portifolio.component';


@NgModule({
  declarations: [
    CarteiraPortifolioComponent,
    CarteiraAtivoComponent,
    CarteiraAtivoFormComponent,
    CarteiraListaAtivosComponent,
    CarteiraFormComponent,
    AlocacaoComponent
  ],
  imports: [
    CommonModule,
    NgbTypeaheadModule,
    FormsModule,
    AtivosRoutingModule
  ],
  exports: [
    CarteiraPortifolioComponent
  ]
})
export class AtivosModule { }
