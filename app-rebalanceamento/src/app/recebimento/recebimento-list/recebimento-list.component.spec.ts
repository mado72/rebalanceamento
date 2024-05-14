import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecebimentoListComponent } from './recebimento-list.component';

describe('RecebimentoListComponent', () => {
  let component: RecebimentoListComponent;
  let fixture: ComponentFixture<RecebimentoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecebimentoListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecebimentoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
