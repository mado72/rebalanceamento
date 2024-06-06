import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[negativo]'
})
export class NegativoDirective {

  constructor(private el: ElementRef) { }
  
  private _negativo = 0;

  private _cor = 'red';
  
  public get negativo() {
    return this._negativo;
  }
  
  @Input()
  public set negativo(value) {
    this._negativo = value;
    if (!!value && value < 0) {
      this.cor = this.cor; // força atualização
    }
  }

  public get cor() {
    return this._cor;
  }
  
  @Input()
  public set cor(value: string) { 
    this._cor = value;
    this.el.nativeElement.style.color = value;
  }


}
