import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import localePt from '@angular/common/locales/pt';
import { PainelComponent } from './painel/painel.component';
import { ContasModule } from './conta/contas.module';
import { AtivosModule } from './ativos/ativos.module';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PainelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ContasModule,
    AtivosModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'pt' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
