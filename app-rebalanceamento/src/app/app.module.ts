import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import localePt from '@angular/common/locales/pt';
import { PainelComponent } from './painel/painel.component';
import { ContasModule } from './conta/contas.module';
import { AtivosModule } from './ativos/ativos.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HandleErrorInterceptor } from './interceptors/handle-error.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MenuComponent } from './menu/menu.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PainelComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ContasModule,
    AtivosModule,
    NgbModule,
    CalendarModule.forRoot({ 
      provide: DateAdapter, 
      useFactory: adapterFactory 
    })
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'pt' },
    {provide: HTTP_INTERCEPTORS, useClass: HandleErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
