import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-modal',
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-md w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
        <ng-content></ng-content>
        <button (click)="close.emit()" class="mt-4">Close Modal</button>
      </div>
    </div>
  `,
  standalone: true, // Add this!
  imports: [CommonModule],
})
export class ModalComponent { // Export the class!
  @Input() isOpen = false;
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
}

@Component({
  selector: 'app-calendar',
  template: `
    <div>
      <p>Selected Date: {{ selected | date }}</p>
      <input type="date" (change)="onDateChange($event)" [value]="selected | date:'yyyy-MM-dd'"/>
    </div>
  `,
  standalone: true, // Add this!
  imports: [CommonModule],
  providers: [DatePipe],
})
export class CalendarComponent { // Export the class!
  @Input() selected: Date | undefined;
  @Output() select = new EventEmitter<Date | undefined>();

  constructor(private datePipe: DatePipe) {}

  onDateChange(event: any) {
    const date = event.target.value ? new Date(event.target.value) : undefined;
    this.select.emit(date);
  }
}
