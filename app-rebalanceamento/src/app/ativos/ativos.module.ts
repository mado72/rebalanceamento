import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtivosRoutingModule } from './ativos-routing.module';
import { CarteiraListComponent } from './carteira-list/carteira-list.component';
import { CarteiraComponent } from './carteira/carteira.component';


@NgModule({
  declarations: [
    CarteiraListComponent,
    CarteiraComponent
  ],
  imports: [
    CommonModule,
    AtivosRoutingModule
  ]
})
export class AtivosModule { }
