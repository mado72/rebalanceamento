import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-carregando',
  templateUrl: './carregando.component.html',
  styleUrls: ['./carregando.component.scss']
})
export class CarregandoComponent implements OnInit {

  @Input()
  carregando: boolean | null = false;

  constructor() { }

  ngOnInit(): void {
  }

}
