import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioMensalComponent } from './calendario-mensal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('CalendarioMensalComponent', () => {
  let component: CalendarioMensalComponent;
  let fixture: ComponentFixture<CalendarioMensalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarioMensalComponent ],
      imports: [ 
        HttpClientTestingModule,
        ToastrModule.forRoot({})
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
