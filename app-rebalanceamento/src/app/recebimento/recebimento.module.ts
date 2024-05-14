import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecebimentoRoutingModule } from './recebimento-routing.module';
import { RecebimentoListComponent } from './recebimento-list/recebimento-list.component';
import { CadastroRecebimentoModalComponent } from './cadastro-recebimento-modal/cadastro-recebimento-modal.component';


@NgModule({
  declarations: [
    RecebimentoListComponent,
    CadastroRecebimentoModalComponent
  ],
  imports: [
    CommonModule,
    RecebimentoRoutingModule
  ]
})
export class RecebimentoModule { }
