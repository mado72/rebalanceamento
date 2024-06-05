import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtivoBuscaComponent } from './ativo-busca.component';

describe('AtivoBuscaComponent', () => {
  let component: AtivoBuscaComponent;
  let fixture: ComponentFixture<AtivoBuscaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtivoBuscaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtivoBuscaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
