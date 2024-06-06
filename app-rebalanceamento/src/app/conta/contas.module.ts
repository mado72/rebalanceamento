import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ContaFormComponent } from './conta-form/conta-form.component';
import { ContasRoutingModule } from './contas-routing.module';
import { SaldosComponent } from './saldos/saldos.component';
import { UtilModule } from '../util/util.module';
import { ContaListComponent } from './conta-list/conta-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NegativoDirective } from '../util/negativo.directive';


@NgModule({
  declarations: [
    SaldosComponent,
    ContaFormComponent,
    ContaListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ContasRoutingModule,
    UtilModule,
    NegativoDirective
  ],
  exports: [
    SaldosComponent
  ]
})
export class ContasModule { }
