import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  constructor() { }
  @Input() email: string;
  @Input() secondMessage: string;
  @Input() action: string;
  @Input() visible: boolean;

  @Output() modalClose = new EventEmitter();
  closed = false;

  closeModal() {
    this.closed = true;
    this.modalClose.emit(this.closed);
  }

  ngOnInit() {
  }

}
