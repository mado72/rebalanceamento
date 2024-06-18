import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransacaoListComponent } from './transacao-list/transacao-list.component';
import { TransacaoCalendarComponent } from './transacao-calendar/transacao-calendar.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
},{
  path: 'list',
  component: TransacaoListComponent
},
//{
//   path: 'pagamentos',
//   component: PagamentoMensalComponent
// },
{
  path: 'calendario',
  component: TransacaoCalendarComponent
}
// ,{
//   path: 'programada',
//   component: DespesaProgramadaComponent
// }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransacaoRoutingModule { }
