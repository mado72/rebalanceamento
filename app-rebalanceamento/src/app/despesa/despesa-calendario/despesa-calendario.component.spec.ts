import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ToastrModule } from 'ngx-toastr';
import { DespesaCalendarioComponent } from './despesa-calendario.component';

describe('DespesaCalendarioComponent', () => {
  let component: DespesaCalendarioComponent;
  let fixture: ComponentFixture<DespesaCalendarioComponent>;

  beforeEach(async () => {
    registerLocaleData(localePt);

    await TestBed.configureTestingModule({
      declarations: [ 
        DespesaCalendarioComponent,
       ],
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        HttpClientTestingModule,
        CalendarModule.forRoot({ 
          provide: DateAdapter, 
          useFactory: adapterFactory 
        }),
        ToastrModule.forRoot({
          positionClass :'toast-bottom-right'
        })
      ],
      providers: [
        {provide: LOCALE_ID, useValue: 'pt' },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespesaCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
