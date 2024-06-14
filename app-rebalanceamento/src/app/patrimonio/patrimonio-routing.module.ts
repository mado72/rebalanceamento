import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FluxoCaixaPrevisaoComponent } from './fluxo-caixa-previsao/fluxo-caixa-previsao.component';
import { PatrimonioProjecaoComponent } from './patrimonio-projecao/patrimonio-projecao.component';
import { PortifolioComponent } from './portifolio/portifolio.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'projecao'
  },
  {
    path: 'projecao',
    component: PatrimonioProjecaoComponent
  },
  {
    path: 'previsao',
    component: FluxoCaixaPrevisaoComponent
  },
  {
    path: 'portifolio',
    component: PortifolioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatrimonioRoutingModule { 

}
