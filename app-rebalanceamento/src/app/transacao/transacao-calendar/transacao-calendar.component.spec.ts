import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoCalendarComponent } from './transacao-calendar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { CalendarioMensalComponent } from 'src/app/calendario/calendario-mensal/calendario-mensal.component';
import { PopupMenuComponent } from 'src/app/util/popup-menu/popup-menu.component';
import { FormsModule } from '@angular/forms';
import { CalendarioMensalCelulaComponent } from 'src/app/calendario/calendario-mensal-celula/calendario-mensal-celula.component';

describe('TransacaoCalendarComponent', () => {
  let component: TransacaoCalendarComponent;
  let fixture: ComponentFixture<TransacaoCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        TransacaoCalendarComponent,
        CalendarioMensalComponent,
        CalendarioMensalCelulaComponent
       ],
      imports: [
        PopupMenuComponent,
        FormsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransacaoCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
