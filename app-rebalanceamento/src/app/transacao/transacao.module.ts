import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TransacaoCalendarComponent } from './transacao-calendar/transacao-calendar.component';
import { TransacaoFormComponent } from './transacao-form/transacao-form.component';
import { TransacaoListComponent } from './transacao-list/transacao-list.component';
import { TransacaoModalComponent } from './transacao-modal/transacao-modal.component';
import { TransacaoRoutingModule } from './transacao-routing.module';
import { CalendarioModule } from '../calendario/calendario.module';
import { PopupMenuComponent } from '../util/popup-menu/popup-menu.component';
import { UtilModule } from '../util/util.module';


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
    UtilModule,
    PopupMenuComponent
  ]
})
export class TransacaoModule { }
