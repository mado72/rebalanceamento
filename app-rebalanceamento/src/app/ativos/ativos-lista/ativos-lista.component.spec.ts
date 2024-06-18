import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { carteiraProviders, utilProviders } from 'src/app/test/test.module';
import { CapitalizePipe } from 'src/app/util/capitalize.pipe';
import { Moeda, TipoAtivo } from '../model/ativos.model';
import { AtivosListaComponent } from './ativos-lista.component';


describe('AtivosListaComponent', () => {
  let component: AtivosListaComponent;
  let fixture: ComponentFixture<AtivosListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        AtivosListaComponent, 
        CapitalizePipe 
      ],
      imports: [
        NgbModalModule
      ],
      providers: [
        ...carteiraProviders,
        ...utilProviders
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtivosListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Deve acrescentar/remover filtro por tipoAtivo', () => {
    component.filtro.tipoAtivo = undefined;

    component.filtrarTipoAtivo(TipoAtivo.ACAO);
    expect(component.filtro.tipoAtivo).toBeTruthy();
    if (component.filtro.tipoAtivo) {
      expect(component.filtro.tipoAtivo).toBe(TipoAtivo.ACAO);
    }
    
    component.filtrarTipoAtivo(TipoAtivo.ACAO);
    expect(component.filtro.tipoAtivo).toBeFalsy();
  })

  it('Deve acrescentar/remover filtro por moeda', () => {
    component.filtro.moeda = undefined;

    component.filtrarMoeda(Moeda.USD);
    expect(component.filtro.moeda).toBeTruthy();
    if (component.filtro.moeda) {
      expect(component.filtro.moeda).toBe(Moeda.USD);
    }
    component.filtrarMoeda(Moeda.USD);
    expect(component.filtro.moeda).toBeFalsy();
  })

  it('Deve carregar todos os ativos disponiveis', ()=> {
    expect(component.ativosDisponiveis).toBeTruthy();
    expect(component.ativosDisponiveis.length).toBe(5);
  })

  it('Sem filtro, deve listar todos os ativos', ()=> {
    expect(component.ativos).toBeTruthy();
    expect(component.ativos.length).toBe(5);
  })

  it('Filtrando por DOLAR deve listar 3 ativos', () => {
    component.filtrarMoeda(Moeda.USD);
    expect(component.ativos).toBeTruthy();
    expect(component.ativos.length).toBe(3);
  })

  it('Filtrando por FII, deve listar 2 ativos', () => {
    component.filtrarTipoAtivo(TipoAtivo.FII);
    expect(component.ativos).toBeTruthy();
    expect(component.ativos.length).toBe(2);
  })

  it('Filtrando por FII e REAL deve listar 1 ativo', () => {
    component.filtrarTipoAtivo(TipoAtivo.FII);
    component.filtrarMoeda(Moeda.BRL);
    expect(component.ativos).toBeTruthy();
    expect(component.ativos.length).toBe(1);
  })

  it('Filtrando por FUNDO, não deve ter item listado', () => {
    component.filtrarTipoAtivo(TipoAtivo.FUNDO);
    expect(component.ativos).toBeTruthy();
    expect(component.ativos.length).toBe(0);
  })

});

