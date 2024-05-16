import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TransacaoCalendarComponent } from './transacao-calendar/transacao-calendar.component';
import { TransacaoFormComponent } from './transacao-form/transacao-form.component';
import { TransacaoListComponent } from './transacao-list/transacao-list.component';
import { TransacaoModalComponent } from './transacao-modal/transacao-modal.component';
import { TransacaoRoutingModule } from './transacao-routing.module';
import { CalendarioModule } from '../calendario/calendario.module';


@NgModule({
  declarations: [
    TransacaoFormComponent,
    TransacaoModalComponent,
    TransacaoListComponent,
    TransacaoCalendarComponent
  ],
  imports: [
    TransacaoRoutingModule,
    CalendarioModule,
    FormsModule,
    CommonModule,
  ]
})
export class TransacaoModule { }
