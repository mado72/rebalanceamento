import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesasListComponent } from './despesas-list.component';
import { Mes, Meses, Pagamento, obterMes } from '../models/despesa';
import { FormsModule } from '@angular/forms';

describe('DespesasListComponent', () => {
  let component: DespesasListComponent;
  let fixture: ComponentFixture<DespesasListComponent>;

  describe('Componente criado', () => {
    
      beforeEach(async () => {
        await TestBed.configureTestingModule({
          declarations: [ DespesasListComponent ],
          imports: [FormsModule]
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
        
        const entries = Object.values(component.pagamentos);
        expect(entries.length).toBe(12);

        entries.forEach(entry=>{
          expect(Object.keys(entry).length).toBeGreaterThan(0);
          const pagamentos = entry["1"];
          expect(pagamentos).toBeTruthy();
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
