import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AtivosModule } from './ativos/ativos.module';
import { ContasModule } from './conta/contas.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HandleErrorInterceptor } from './interceptors/handle-error.interceptor';
import { MenuComponent } from './menu/menu.component';
import { PainelComponent } from './painel/painel.component';
import { UtilModule } from './util/util.module';
import { PatrimonioModule } from './patrimonio/patrimonio.module';
import { CalendarioModule } from './calendario/calendario.module';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PainelComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    AtivosModule,
    ContasModule,
    PatrimonioModule,
    CalendarioModule,
    UtilModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'pt' },
    {provide: HTTP_INTERCEPTORS, useClass: HandleErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
