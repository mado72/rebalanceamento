import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldosComponent } from './saldos.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SaldosComponent', () => {
  let component: SaldosComponent;
  let fixture: ComponentFixture<SaldosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldosComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
