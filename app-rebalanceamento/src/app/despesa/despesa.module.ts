import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DespesaRoutingModule } from './despesa-routing.module';
import { DespesasListComponent } from './despesas-list/despesas-list.component';
import { DespesaFormComponent } from './despesa-form/despesa-form.component';


@NgModule({
  declarations: [
    DespesasListComponent,
    DespesaFormComponent
  ],
  imports: [
    CommonModule,
    DespesaRoutingModule
  ]
})
export class DespesaModule { }
