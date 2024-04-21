import { Component, OnInit } from '@angular/core';
import { CarteiraImpl } from '../model/ativos.model';
import { CarteiraService } from '../services/carteira.service';

@Component({
  selector: 'app-carteira-list',
  templateUrl: './carteira-list.component.html',
  styleUrls: ['./carteira-list.component.scss']
})
export class CarteiraListComponent implements OnInit{
  carteiras!: CarteiraImpl[];

  constructor(private carteiraService: CarteiraService) {

  }

  ngOnInit(): void {
      this.carteiraService.listarCarteiras().subscribe(carteiras=>this.carteiras = carteiras);
  }

}
