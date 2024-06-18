import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioMensalComponent } from './calendario-mensal/calendario-mensal.component';

const routes: Routes = [{
  path: '',
  component: CalendarioMensalComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarioRoutingModule { }
