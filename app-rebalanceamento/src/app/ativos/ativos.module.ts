import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtivosRoutingModule } from './ativos-routing.module';
import { CarteiraListComponent } from './carteira-list/carteira-list.component';


@NgModule({
  declarations: [
    CarteiraListComponent
  ],
  imports: [
    CommonModule,
    AtivosRoutingModule
  ]
})
export class AtivosModule { }
