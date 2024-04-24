import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaldosComponent } from './saldos/saldos.component';

const routes: Routes = [{
  path: "",
  pathMatch: "full",
  redirectTo: "saldos"
},{
  path: "saldos",
  component: SaldosComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContasRoutingModule { }
