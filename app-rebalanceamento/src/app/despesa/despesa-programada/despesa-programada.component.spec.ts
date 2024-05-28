import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DespesaProgramadaComponent } from './despesa-programada.component';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('DespesaProgramadaComponent', () => {
  let component: DespesaProgramadaComponent;
  let fixture: ComponentFixture<DespesaProgramadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DespesaProgramadaComponent ],
      imports: [
        CommonModule,
        FormsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespesaProgramadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
