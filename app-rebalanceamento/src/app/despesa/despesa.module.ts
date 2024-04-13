import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DespesaFormComponent } from './despesa-form/despesa-form.component';
import { DespesaRoutingModule } from './despesa-routing.module';
import { DespesasListComponent } from './despesas-list/despesas-list.component';


@NgModule({
  declarations: [
    DespesasListComponent,
    DespesaFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DespesaRoutingModule
  ]
})
export class DespesaModule { }
