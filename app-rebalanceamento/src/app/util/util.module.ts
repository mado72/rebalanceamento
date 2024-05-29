import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from './capitalize.pipe';
import { NumFormatPipe } from './num-format.pipe';



@NgModule({
  declarations: [
    CapitalizePipe,
    NumFormatPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    CapitalizePipe,
    NumFormatPipe
  ]
})
export class UtilModule { }
