import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.scss']
})
export class LedComponent implements OnInit {

  @Input() color: 'red'|'green'|'yellow' = 'red';

  constructor() { }

  ngOnInit(): void {
  }

  public get led() {
    return `led-${this.color}`;
  }

}
