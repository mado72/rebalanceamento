import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
},{
  path: 'home',
  component: HomeComponent
},{
  path: 'despesas',
  loadChildren: () => import('./despesa/despesa.module').then(m => m.DespesaModule)
},{
  path: 'ativos',
  loadChildren: () => import('./ativos/ativos.module').then(m => m.AtivosModule)
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
