import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesasListComponent } from './despesas-list.component';
import { Mes, Meses, Pagamento, obterMes } from '../models/despesa';

describe('DespesasListComponent', () => {
  let component: DespesasListComponent;
  let fixture: ComponentFixture<DespesasListComponent>;

  describe('Componente criado', () => {
    
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [ DespesasListComponent ]
        })
        .compileComponents();
    
        fixture = TestBed.createComponent(DespesasListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
    
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    
      it('deve conter 12 listas de pagamentos', ()=>{
        
        const entries = [...component.matriz];
        expect(entries.length).toBe(12);
        entries.forEach(entry=>{
          const pagamentos = component.matriz.get(entry[0]);
          expect(pagamentos).toBeTruthy();
          if (!!pagamentos) {
            expect(pagamentos.length).toBeGreaterThan(0);
          }
        });
      });
      
  })

  it('deve obter o pagamento para um mes aleatório', () => {
    component = new DespesasListComponent();
    debugger;
    component.ngOnInit();
    Object.values(Meses).forEach(mes=>{
      let pagamentos = component.pagamentos[mes];
      debugger;
      expect(pagamentos).toBeTruthy();
      expect(pagamentos[1]).toBeTruthy();
    });
  });
});
