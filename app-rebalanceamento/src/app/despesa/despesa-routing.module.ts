import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DespesasListComponent } from './despesas-list/despesas-list.component';
import { DespesaFormComponent } from './despesa-form/despesa-form.component';

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
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespesaRoutingModule { }
