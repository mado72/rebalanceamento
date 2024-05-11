import { CommonModule, NgSwitchCase } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CadastroDespesaModalComponent } from './cadastro-despesa-modal/cadastro-despesa-modal.component';
import { DespesaFormComponent } from './despesa-form/despesa-form.component';
import { DespesaProgramadaComponent } from './despesa-programada/despesa-programada.component';
import { DespesaRoutingModule } from './despesa-routing.module';
import { DespesasListComponent } from './despesas-list/despesas-list.component';
import { PagamentoMensalComponent } from './pagamento-mensal/pagamento-mensal.component';
import { DespesaCalendarioComponent } from './despesa-calendario/despesa-calendario.component';


@NgModule({
  declarations: [
    DespesasListComponent,
    DespesaFormComponent,
    PagamentoMensalComponent,
    DespesaProgramadaComponent,
    CadastroDespesaModalComponent,
    DespesaCalendarioComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    DespesaRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  exports: [
    DespesaFormComponent
  ]
})
export class DespesaModule { }
