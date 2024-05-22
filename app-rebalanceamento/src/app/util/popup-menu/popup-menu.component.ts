import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.scss']
})
export class PopupMenuComponent {
  @HostBinding("style.top") y = "0px"
  @HostBinding("style.left") x = "0px"
  @HostBinding("style.visibility") visibility = "hidden"
  @Input() @HostBinding("style.width") width = "200px"

  constructor() {}

  open(e:MouseEvent) {
    this.x = e.pageX + "px"
    this.y = e.pageY + "px"
    this.visibility = "visible"
    e.stopPropagation();
  }
  
  close() {
    this.visibility = "hidden"
  }

  @HostListener("click", ["$event"])
  onComponentClick(e: KeyboardEvent) {
  }
  
  @HostListener("document:click", ["$event"])
  onDocumentClick(e: MouseEvent) {
    if (this.visibility === "visible") {
      this.close();
    }
  }
}
