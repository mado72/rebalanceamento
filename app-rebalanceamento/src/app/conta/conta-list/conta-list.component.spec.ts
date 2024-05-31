import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaListComponent } from './conta-list.component';

describe('ContaListComponent', () => {
  let component: ContaListComponent;
  let fixture: ComponentFixture<ContaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
