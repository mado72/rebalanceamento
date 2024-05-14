import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[moeda-cor]'
})
export class MoedaCorDirective implements OnInit, OnChanges{

  constructor(private el: ElementRef, private viewContainer: ViewContainerRef) {
  }
  
  ngOnInit(): void {
    this.styleColor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.el.nativeElement.style.originalValue = this.el.nativeElement.innerText;
    this.styleColor();
  }

  private styleColor() {
    const innerText = this.el.nativeElement.innerText;
    const originalValue = this.el.nativeElement.style.originalValue;
    let value: any = Number(originalValue || innerText);
    if (isNaN(value)) {
      value = '-';
    }
    else {
      let color = value >= 0 ? 'black' : 'red';
      let valueStr = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      this.viewContainer.clear();
      this.viewContainer.element.nativeElement.innerText = valueStr;
      this.el.nativeElement.style.color = color;
      this.el.nativeElement.style.originalValue = value;
      debugger;
    }
  }
}
