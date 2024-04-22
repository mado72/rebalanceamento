import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AtivosRoutingModule } from './ativos-routing.module';
import { CarteiraAtivoFormComponent } from './carteira-ativo-form/carteira-ativo-form.component';
import { CarteiraFormComponent } from './carteira-form/carteira-form.component';
import { CarteiraListComponent } from './carteira-portifolio/carteira-portifolio.component';
import { CarteiraListaAtivosComponent } from './carteira-lista-ativos/carteira-lista-ativos.component';
import { CarteiraAtivoComponent } from './carteira-ativo/carteira-ativo.component';


@NgModule({
  declarations: [
    CarteiraListComponent,
    CarteiraAtivoComponent,
    CarteiraAtivoFormComponent,
    CarteiraListaAtivosComponent,
    CarteiraFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AtivosRoutingModule
  ]
})
export class AtivosModule { }
