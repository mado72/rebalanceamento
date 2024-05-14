import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecebimentoListComponent } from './recebimento-list/recebimento-list.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
}, {
  path: 'list',
  component: RecebimentoListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecebimentoRoutingModule { }
