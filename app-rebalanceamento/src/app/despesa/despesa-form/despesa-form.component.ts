import { Component, Input, OnInit } from '@angular/core';
import { DespesasService } from '../services/despesas.service';
import { Despesa } from '../models/despesa';

@Component({
  selector: 'app-despesa-form',
  templateUrl: './despesa-form.component.html',
  styleUrls: ['./despesa-form.component.scss']
})
export class DespesaFormComponent implements OnInit {
  despesa: Despesa = { id: null, valor: 10, diaVencimento: 1, paga: false, get pagamentoAntecipado() { return this.diaVencimento < 20; } }; // Preencha com valores iniciais

  constructor(private despesasService: DespesasService) {} // Injete o serviço de despesas

  ngOnInit(): void {
    // Carregue a despesa para edição se o ID for diferente de 0 (edição)
    if (!! this.despesa.id) {
      this.despesasService.obter(this.despesa.id).subscribe(despesa => {
        this.despesa = despesa;
      });
    }
  }

  onSubmit() {
    if (this.despesa.id === 0) { // Nova despesa
      this.despesasService.adicionarDespesa(this.despesa).subscribe(() => {
        // Exiba mensagem de sucesso e atualize a lista de despesas
        this.despesa = { id: 0, valor: 0, diaVencimento: 1, paga: false, pagamentoAntecipado: false }; // Limpe o formulário
      });
    } else { // Editar despesa existente
      this.despesasService.atualizarDespesa(this.despesa).subscribe(() => {
        // Exiba mensagem de sucesso e atualize a lista de despesas
      });
    }
  }
}