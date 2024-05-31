import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatrimonioRoutingModule } from './patrimonio-routing.module';
import { PatrimonioProjecaoComponent } from './patrimonio-projecao/patrimonio-projecao.component';
import { UtilModule } from '../util/util.module';
import { FluxoCaixaPrevisaoComponent } from './fluxo-caixa-previsao/fluxo-caixa-previsao.component';


@NgModule({
  declarations: [
    PatrimonioProjecaoComponent,
    FluxoCaixaPrevisaoComponent
  ],
  imports: [
    CommonModule,
    UtilModule,
    PatrimonioRoutingModule
  ],
  exports: [
    FluxoCaixaPrevisaoComponent
  ]
})
export class PatrimonioModule { }
