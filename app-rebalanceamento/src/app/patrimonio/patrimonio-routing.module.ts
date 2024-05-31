import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatrimonioProjecaoComponent } from './patrimonio-projecao/patrimonio-projecao.component';
import { FluxoCaixaPrevisaoComponent } from './fluxo-caixa-previsao/fluxo-caixa-previsao.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatrimonioRoutingModule { }
