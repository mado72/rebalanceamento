import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteiraPortifolioComponent } from './carteira-portifolio/carteira-portifolio.component';
import { AlocacaoComponent } from './alocacao/alocacao.component';
import { AtivosListaComponent } from './ativos-lista/ativos-lista.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'carteiras',
  pathMatch: 'full'
},{
  path: "carteiras",
  component: CarteiraPortifolioComponent
},{
  path: "carteira/:carteira",
  component: CarteiraPortifolioComponent,
},{
  path: "alocacao",
  component: AlocacaoComponent
},{
  path: "lista",
  component: AtivosListaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtivosRoutingModule { }
