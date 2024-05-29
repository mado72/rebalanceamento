import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ContaFormComponent } from './conta-form/conta-form.component';
import { ContasRoutingModule } from './contas-routing.module';
import { SaldosComponent } from './saldos/saldos.component';
import { UtilModule } from '../util/util.module';


@NgModule({
  declarations: [
    SaldosComponent,
    ContaFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ContasRoutingModule,
    UtilModule
  ],
  exports: [
    SaldosComponent
  ]
})
export class ContasModule { }
