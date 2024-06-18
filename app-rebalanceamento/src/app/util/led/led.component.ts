import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export type LedColors = 'red'|'green'|'yellow';

@Component({
  standalone: true,
  selector: 'app-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.scss'],
  imports: [CommonModule]
})
export class LedComponent implements OnInit {

  @Input() color: LedColors = 'red';

  constructor() { }

  ngOnInit(): void {
  }

  public get led() {
    return `led-${this.color}`;
  }

}
