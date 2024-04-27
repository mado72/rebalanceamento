import { Component, OnInit } from '@angular/core';
import { DespesasService } from '../services/despesas.service';
import { DespesaRecorrenteImpl } from '../models/despesa.model';

@Component({
  selector: 'app-despesa-programada',
  templateUrl: './despesa-programada.component.html',
  styleUrls: ['./despesa-programada.component.scss']
})
export class DespesaProgramadaComponent implements OnInit {

  despesas: DespesaRecorrenteImpl[] = [];

  constructor(private _despesasService: DespesasService) {}
  
  ngOnInit(): void {
    this._despesasService.obterDespesas().subscribe(despesas=>this.despesas=despesas);
  }

  get total() {
    const total = this.despesas.map(despesa=>despesa.valor).reduce((acc,vl)=>acc+=vl);
    return total;
  }


}
