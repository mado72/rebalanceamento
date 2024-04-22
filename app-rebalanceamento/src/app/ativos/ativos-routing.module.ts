import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteiraListComponent } from './carteira-portifolio/carteira-portifolio.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'carteiras',
  pathMatch: 'full'
},{
  path: "carteiras",
  component: CarteiraListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtivosRoutingModule { }
