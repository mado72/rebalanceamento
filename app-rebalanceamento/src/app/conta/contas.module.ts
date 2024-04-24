import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContasRoutingModule } from './contas-routing.module';
import { SaldosComponent } from './saldos/saldos.component';
import { FormsModule } from '@angular/forms';
import { ContaFormComponent } from './conta-form/conta-form.component';


@NgModule({
  declarations: [
    SaldosComponent,
    ContaFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ContasRoutingModule
  ],
  exports: [
    SaldosComponent
  ]
})
export class ContasModule { }
