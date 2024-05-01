import { Component, Input, OnInit } from '@angular/core';
import { DespesasService } from '../services/despesas.service';
import { DespesaRecorrenteImpl, Periodicidade, TipoLiquidacao } from '../models/despesa.model';
import { ActivatedRoute } from '@angular/router';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-despesa-form',
  templateUrl: './despesa-form.component.html',
  styleUrls: ['./despesa-form.component.scss']
})
export class DespesaFormComponent implements OnInit {
  despesa = new DespesaRecorrenteImpl({
    descricao: '',
    valor: 0, 
    dataVencimento: new Date(), 
    periodicidade: Periodicidade.MENSAL,
    liquidacao: TipoLiquidacao.CONTA
  }); // Preencha com valores iniciais

  constructor(private despesasService: DespesasService, private route : ActivatedRoute) {} // Injete o serviço de despesas

  get categorias() {
    return ["Custos fixos", "Conforto", "Metas", "Prazeres", "Liberdade Financeira", "Conhecimento"];
  }

  get liquidacoes() {
    return [TipoLiquidacao.CONTA, TipoLiquidacao.CARTAO];
  }

  get diaVencimento() {
    return this.despesa.diaVencimento;
  }

  set diaVencimento(val: number) {
    let data = DateTime.fromJSDate(this.despesa.dataVencimento);
    data.set({ day: val })
    this.despesa.dataVencimento = data.toJSDate();
  }

  get periodicidades() {
    return Object.values(Periodicidade);
  }

  ngOnInit(): void {
    const paramId = this.route.snapshot.params['id'];
    // Carregue a despesa para edição se o ID for diferente de 0 (edição)
    if (!! this.despesa._id) {
      this.despesasService.obterDespesa(this.despesa._id).subscribe(despesa => {
        this.despesa = despesa;
      });
    }
    else {
      if (!! paramId) {
        this.despesasService.obterDespesa(paramId).subscribe(despesa => {
          this.despesa = despesa;
        });
      }
    }
  }

  onSubmit() {
    if (! this.despesa._id ) {
      this.despesasService.adicionarDespesa(this.despesa)
        .subscribe(despesa=>this.despesa = despesa);
    }
    else {
      this.despesasService.atualizarDespesa(this.despesa).subscribe(()=>{
        console.log(`Despesa atualizada com sucesso: ${this.despesa.descricao}`);
      });
    }
  }
}