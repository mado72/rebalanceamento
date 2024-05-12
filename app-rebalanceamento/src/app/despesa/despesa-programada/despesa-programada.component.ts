import { Component, OnInit } from '@angular/core';
import { getTime } from 'date-fns';
import { DespesaRecorrenteImpl } from '../models/despesa.model';
import { DespesasService } from '../services/despesas.service';

@Component({
  selector: 'app-despesa-programada',
  templateUrl: './despesa-programada.component.html',
  styleUrls: ['./despesa-programada.component.scss']
})
export class DespesaProgramadaComponent implements OnInit {

  filtrarPagos = true;
  filtrarVencidos = false;

  _despesas: DespesaRecorrenteImpl[] = [];

  constructor(
    private _despesasService: DespesasService,
  ) {}
  
  ngOnInit(): void {
    this.obterDespesas();
  }
  
  private obterDespesas() {
    const now = new Date();
    this._despesasService.obterDespesas().subscribe(despesas => {
      this._despesas = despesas
        .filter(d => !this.filtrarVencidos || !d.dataFinal || d.dataFinal > now)
        .sort((a, b) => getTime(a.dataVencimento) - getTime(b.dataVencimento) || a.descricao.localeCompare(b.descricao));
    });
  }

  get total() {
    const total = this.despesas.map(despesa=>despesa.valor).reduce((acc,vl)=>acc+=vl,0);
    return total;
  }

  get despesas() {
    return !this.filtrarPagos && this._despesas 
      || this._despesas.filter(despesa=>!despesa.dataPagamento);
  }

  adicionarDespesa() {
    const despesa = new DespesaRecorrenteImpl({});
    this.abrirDespesaForm(despesa, 'Adicionar Despesa');
  }

  abrirDespesaForm(despesa: DespesaRecorrenteImpl, titulo: string) {
    this._despesasService.abrirDespesaForm(despesa, titulo).subscribe(()=>{
      console.log(`Recebeu evento de abrirDespesaForm`)
      this.obterDespesas();
    });
  }


}
