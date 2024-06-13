import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotacaoRoutingModule } from './cotacao-routing.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CotacaoRoutingModule,
    HttpClientModule
  ]
})
export class CotacaoModule { }
