import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarioRoutingModule } from './calendario-routing.module';
import { CalendarioMensalComponent } from './calendario-mensal/calendario-mensal.component';
import { CalendarioMensalCelulaComponent } from './calendario-mensal-celula/calendario-mensal-celula.component';
import { LedComponent } from '../util/led/led.component';


@NgModule({
  declarations: [
    CalendarioMensalComponent,
    CalendarioMensalCelulaComponent
  ],
  imports: [
    CommonModule,
    CalendarioRoutingModule,
    LedComponent
  ]
})
export class CalendarioModule { }
