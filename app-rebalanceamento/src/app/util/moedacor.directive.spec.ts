import { Component, DebugElement } from '@angular/core';
import { MoedaCorDirective } from './moedacor.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  template:`{{valor}}
    <div moeda-cor id="valorRed">-123.10</div>
    <div moeda-cor id="valorBlack">{{valor}}</div>`,
  imports:[MoedaCorDirective]
})
export class MockComponent {
  valor = 123.10;
}

describe('MoedaCorDiretive', () => {
  let fixture : ComponentFixture<MockComponent>;
  let des: DebugElement[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MoedaCorDirective, MockComponent]
    });
    fixture = TestBed.createComponent(MockComponent);
    fixture.componentInstance.valor = 123.10;
    fixture.detectChanges();

    des = fixture.debugElement.queryAll(By.directive(MoedaCorDirective));
  });

  it('deve conter 2 elementos', ()=>{
    expect(des.length).toBe(2);
  })
  
  it('o primeiro elemento deve ser vermelho', ()=>{
    expect(des[0].nativeElement.style.color).toBe('red');
  })
  
  it('o segundo elemento deve ser verde', ()=>{
    expect(des[1].nativeElement.style.color).toBe('black');
  })
  
  it('deve mudar de cor quando numero tornar-se positivo', ()=>{
    fixture.autoDetectChanges(true);
    fixture.componentInstance.valor = -123.10;
    expect(des[1].nativeElement.style.color).toBe('black');
  })

});
