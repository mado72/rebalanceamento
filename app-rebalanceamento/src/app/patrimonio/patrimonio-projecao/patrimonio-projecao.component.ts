import { Component, OnInit } from '@angular/core';
import { endOfYear, getMonth, startOfDay, startOfMonth } from 'date-fns';
import { ContaService } from 'src/app/conta/services/conta.service';
import { Mes, TipoTransacao } from 'src/app/transacao/models/transacao.model';
import { MatrizTransacoes, TransacaoMatrizService } from 'src/app/transacao/services/transacao-matriz.service';

type Acumulador = {[key: string]: number};

@Component({
  selector: 'app-patrimonio-projecao',
  templateUrl: './patrimonio-projecao.component.html',
  styleUrls: ['./patrimonio-projecao.component.scss']
})
export class PatrimonioProjecaoComponent implements OnInit { 

  readonly mesesStr = Object.keys(Mes);

  matriz: any;

  saldo: number[] = new Array(12).fill(0);

  resultadoMensal: number[] = new Array(12).fill(0);

  despesas: number[] = new Array(12).fill(0);

  recebimentos: number[] = new Array(12).fill(0);

  meses = new Array(12).fill(0).map((_,idx)=>idx+1);

  constructor(
    private _contaService: ContaService,
    private _matrizService: TransacaoMatrizService
  ) { }

  ngOnInit(): void {
    
    this._contaService.listarContas().subscribe(contas=>{
      
      const inicio = startOfMonth(new Date());
      const fim = endOfYear(inicio);
      const mesCorrente = getMonth(inicio);

      this.saldo[mesCorrente] = contas.reduce((acc, conta)=>acc += conta.saldo, 0);

      this._matrizService.obterTransacoesIntervalo({inicio, fim}).subscribe(matriz=>{

        console.log(matriz);
        this.matriz = matriz;
        
        new Array(...matriz.values()).forEach(linha=>{
          this.meses.forEach(mesIdx => {
            let mes = mesIdx - 1;

            const acc = linha[mes]
              .filter(transacao=>! transacao.liquidada)
              .filter(transacao=>[TipoTransacao.CREDITO, TipoTransacao.DEBITO].includes(transacao.tipoTransacao))
              .map(transacao=>{
                const tipo = (transacao.tipoTransacao == TipoTransacao.DEBITO ? "DEBITO" : "CREDITO") as string;
                const a : any = new Object();
                a.tipo = tipo;
                a.valor = transacao.valor;
                return a
              })
              .reduce((acc, transacao: any)=> {
                acc[transacao.tipo]+= transacao.valor;
                return acc;
              }, ({'DEBITO':0, 'CREDITO':0} as Acumulador));

            // const despesaMensal = linha[mes]
            //   .filter(transacao => transacao.tipoTransacao == TipoTransacao.DEBITO)
            //   .reduce((acc, transacao) => acc += transacao.valor, 0);
            // const recebimentoMensal = linha[mes]
            //   .filter(transacao => transacao.tipoTransacao == TipoTransacao.CREDITO)
            //   .reduce((acc, transacao) => acc += transacao.valor, 0);

            const despesaMensal = acc.DEBITO;
            const recebimentoMensal = acc.CREDITO;

            this.despesas[mes] += despesaMensal;

            this.recebimentos[mes] += recebimentoMensal;

            this.resultadoMensal[mes] += recebimentoMensal - despesaMensal;
          });
        });

        this.meses.forEach(mes=>{
          this.saldo[mes] += this.resultadoMensal[mes] + (mes > 1? this.saldo[mes-1]:0);
        })
      })
    })

  }

  get mesCorrente() {
    return getMonth(startOfMonth(new Date()));
  }

}
