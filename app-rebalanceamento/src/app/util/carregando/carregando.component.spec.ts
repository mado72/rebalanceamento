import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarregandoComponent } from './carregando.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-carregando',
  templateUrl: './carregando.component.html',
  styleUrls: ['./carregando.component.scss'],
  imports: [
    CommonModule
  ]
})
export class TestComponent extends CarregandoComponent {
  constructor() {
    super();
  }
}

describe('CarregandoComponent', () => {
  let component: CarregandoComponent;
  let fixture: ComponentFixture<CarregandoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
      ],
      imports: [
        TestComponent,
        CommonModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
