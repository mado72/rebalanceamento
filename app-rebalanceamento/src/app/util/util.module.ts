import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from './capitalize.pipe';
import { NumFormatPipe } from './num-format.pipe';
import { AbsolutePipe } from './absolute.pipe';
import { NegativoDirective } from './negativo.directive';



@NgModule({
  declarations: [
    CapitalizePipe,
    NumFormatPipe,
    AbsolutePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CapitalizePipe,
    NumFormatPipe,
    AbsolutePipe
  ]
})
export class UtilModule { }
