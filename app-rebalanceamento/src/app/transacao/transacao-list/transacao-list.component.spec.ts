import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransacaoListComponent } from './transacao-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { PopupMenuComponent } from 'src/app/util/popup-menu/popup-menu.component';
import { Component } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-transacao-list',
  templateUrl: './transacao-list.component.html',
  styleUrls: ['./transacao-list.component.scss'],
  standalone: true,
  imports: [
    PopupMenuComponent,
    CommonModule,
    FormsModule
  ]
})
export class TestComponent extends TransacaoListComponent {

}

describe('TransacaoListComponent', () => {
  let component: TransacaoListComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right'
        }),
        TestComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
