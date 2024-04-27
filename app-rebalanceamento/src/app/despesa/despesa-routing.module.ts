import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DespesaFormComponent } from './despesa-form/despesa-form.component';
import { DespesasListComponent } from './despesas-list/despesas-list.component';
import { PagamentoMensalComponent } from './pagamento-mensal/pagamento-mensal.component';
import { DespesaProgramadaComponent } from './despesa-programada/despesa-programada.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
},{
  path: 'list',
  component: DespesasListComponent
},{
  path: 'edit',
  component: DespesaFormComponent
},{
  path: 'edit/:id',
  component: DespesaFormComponent
},{
  path: 'pagamentos',
  component: PagamentoMensalComponent
},{
  path: 'programada',
  component: DespesaProgramadaComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespesaRoutingModule { }
