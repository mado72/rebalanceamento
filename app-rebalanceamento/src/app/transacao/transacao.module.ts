import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { FormsModule } from '@angular/forms';
import { TransacaoCalendarComponent } from './transacao-calendar/transacao-calendar.component';
import { TransacaoFormComponent } from './transacao-form/transacao-form.component';
import { TransacaoListComponent } from './transacao-list/transacao-list.component';
import { TransacaoModalComponent } from './transacao-modal/transacao-modal.component';
import { TransacaoRoutingModule } from './transacao-routing.module';


@NgModule({
  declarations: [
    TransacaoFormComponent,
    TransacaoModalComponent,
    TransacaoListComponent,
    TransacaoCalendarComponent
  ],
  imports: [
    TransacaoRoutingModule,
    FormsModule,
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ]
})
export class TransacaoModule { }
