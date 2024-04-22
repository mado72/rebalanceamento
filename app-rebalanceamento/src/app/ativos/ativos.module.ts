import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtivosRoutingModule } from './ativos-routing.module';
import { CarteiraListComponent } from './carteira-list/carteira-list.component';
import { CarteiraComponent } from './carteira/carteira.component';
import { CarteiraItemFormComponent } from './carteira-item-form/carteira-item-form.component';
import { FormsModule } from '@angular/forms';
import { CarteiraListaAtivosComponent } from './carteira-lista-ativos/carteira-lista-ativos.component';


@NgModule({
  declarations: [
    CarteiraListComponent,
    CarteiraComponent,
    CarteiraItemFormComponent,
    CarteiraListaAtivosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AtivosRoutingModule
  ]
})
export class AtivosModule { }
