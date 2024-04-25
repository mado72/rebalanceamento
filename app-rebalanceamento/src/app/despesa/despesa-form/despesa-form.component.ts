import { Component, Input, OnInit } from '@angular/core';
import { DespesasService } from '../services/despesas.service';
import { DespesaProgramada } from '../models/despesa.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-despesa-form',
  templateUrl: './despesa-form.component.html',
  styleUrls: ['./despesa-form.component.scss']
})
export class DespesaFormComponent implements OnInit {
  despesa: DespesaProgramada = { id: null, valor: 10, diaVencimento: 1, nome: '' }; // Preencha com valores iniciais

  constructor(private despesasService: DespesasService, private route : ActivatedRoute) {} // Injete o serviço de despesas

  ngOnInit(): void {
    const paramId = Number(this.route.snapshot.params['id']);
    // Carregue a despesa para edição se o ID for diferente de 0 (edição)
    if (!! this.despesa.id) {
      this.despesasService.obter(this.despesa.id).subscribe(despesa => {
        this.despesa = despesa;
      });
    }
    else {
      if (!! paramId) {
        this.despesasService.obter(paramId).subscribe(despesa => {
          this.despesa = despesa;
        });
      }
    }
  }

  onSubmit() {
    if (this.despesa.id === 0) { // Nova despesa
      this.despesasService.adicionarDespesa(this.despesa).subscribe(() => {
        // Exiba mensagem de sucesso e atualize a lista de despesas
        this.despesa = { id: 0, valor: 0, nome: '', diaVencimento: 1 }; // Limpe o formulário
      });
    } else { // Editar despesa existente
      this.despesasService.atualizarDespesa(this.despesa).subscribe(() => {
        // Exiba mensagem de sucesso e atualize a lista de despesas
      });
    }
  }
}