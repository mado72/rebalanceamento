import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlocacaoComponent } from './alocacao.component';

describe('AlocacaoComponent', () => {
  let component: AlocacaoComponent;
  let fixture: ComponentFixture<AlocacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlocacaoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlocacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
