import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesaFormComponent } from './despesa-form.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('DespesaFormComponent', () => {
  let component: DespesaFormComponent;
  let fixture: ComponentFixture<DespesaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DespesaFormComponent ],
      imports: [ 
        FormsModule,
        RouterTestingModule.withRoutes([])
       ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DespesaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
