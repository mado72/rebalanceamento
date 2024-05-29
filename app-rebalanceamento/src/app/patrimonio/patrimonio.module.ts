import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatrimonioRoutingModule } from './patrimonio-routing.module';
import { PatrimonioProjecaoComponent } from './patrimonio-projecao/patrimonio-projecao.component';
import { UtilModule } from '../util/util.module';


@NgModule({
  declarations: [
    PatrimonioProjecaoComponent
  ],
  imports: [
    CommonModule,
    UtilModule,
    PatrimonioRoutingModule
  ]
})
export class PatrimonioModule { }
