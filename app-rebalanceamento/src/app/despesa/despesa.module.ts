import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DespesaFormComponent } from './despesa-form/despesa-form.component';
import { DespesaRoutingModule } from './despesa-routing.module';
import { DespesasListComponent } from './despesas-list/despesas-list.component';
import { PagamentoMensalComponent } from './pagamento-mensal/pagamento-mensal.component';
import { DespesaProgramadaComponent } from './despesa-programada/despesa-programada.component';
import { HttpClientModule } from  '@angular/common/http';
import { CadastroDespesaModalComponent } from './cadastro-despesa-modal/cadastro-despesa-modal.component';


@NgModule({
  declarations: [
    DespesasListComponent,
    DespesaFormComponent,
    PagamentoMensalComponent,
    DespesaProgramadaComponent,
    CadastroDespesaModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DespesaRoutingModule
  ],
  exports: [
    DespesaFormComponent
  ]
})
export class DespesaModule { }
