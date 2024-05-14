import { Component, Input } from '@angular/core';
import { DespesaRecorrenteImpl } from '../models/despesa.model';
import { Periodicidade, TipoLiquidacao } from 'src/app/transacao/models/transacao.model';

@Component({
  selector: 'app-despesa-form',
  templateUrl: './despesa-form.component.html',
  styleUrls: ['./despesa-form.component.scss']
})
export class DespesaFormComponent {
  @Input() despesa = new DespesaRecorrenteImpl({}); // Preencha com valores iniciais

  constructor() {}

  get categorias() {
    // TODO Obter categorias de um serviço
    return ["Custos fixos", "Conforto", "Metas", "Prazeres", "Liberdade Financeira", "Conhecimento"];
  }

  get liquidacoes() {
    // TODO Obter as contas de liquidação
    return [TipoLiquidacao.CONTA, TipoLiquidacao.CARTAO];
  }

  get periodicidades() {
    return Object.values(Periodicidade);
  }

  // onSubmit() {
  //   let error = (error:any)=> {
  //     this.alertService.alert({
  //       mensagem: `Erro ao atualizar despesa.${error.message ? '<br>\n<b>Origem:</b>' + error.message : ''}`,
  //       titulo: 'Resultado da operação',
  //       tipo: 'erro'
  //     })
  //   };
  //   if (!this.despesa._id) {
  //     this.despesasService.adicionarDespesa(this.despesa)
  //       .subscribe({
  //         next: despesa => {
  //           this.despesa = despesa;
  //           this.alertService.alert({
  //             mensagem: 'Despesa cadastrada com sucesso!',
  //             titulo: 'Resultado da operação',
  //             tipo: 'sucesso'
  //           })
  //         },
  //         error
  //       });
  //   }
  //   else {
  //     this.despesasService.atualizarDespesa(this.despesa).subscribe({
  //       next: () => {
  //         this.alertService.alert({
  //           mensagem: 'Despesa atualizada com sucesso!',
  //           titulo: 'Resultado da operação',
  //           tipo:'sucesso'
  //         })
  //       },
  //       error
  //     });
  //   }
  // }
}