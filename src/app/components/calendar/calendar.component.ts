    import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
    import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Removed conflicting import of CalendarComponent
    @Component({
      selector: 'app-calendar',
      templateUrl: './calendar.component.html',
      styleUrls: ['./calendar.component.scss'],
      providers: [DatePipe],
  imports: [CommonModule],
    })
    export class CalendarComponent implements OnInit, OnChanges {
      @Input() mode: 'single' | 'multiple' | 'range' = 'single';
      @Input() selected: Date | Date[] | undefined;
      @Output() select = new EventEmitter<Date | Date[] | undefined>();

      currentMonth: Date = new Date();
      calendarDays: (Date | null)[][] = [];
      selectedDates: Date[] = []; // Internal representation for all modes

      constructor(private datePipe: DatePipe) {}

      ngOnInit(): void {
        this.generateCalendar();
        this.initializeSelectedDates();
      }

      ngOnChanges(changes: SimpleChanges): void {
        if (changes['selected']) {
          this.initializeSelectedDates();
          this.generateCalendar(); // Regenerate calendar when selected changes
        }
      }

        private initializeSelectedDates() {
          this.selectedDates = [];
          if (this.selected) {
            if (this.mode === 'single') {
              this.selectedDates.push(this.selected as Date);
            } else if (this.mode === 'multiple') {
              this.selectedDates = this.selected as Date[];
            } else if (this.mode === 'range') {
              const dates = this.selected as Date[];
              if (dates.length > 0) {
                this.selectedDates.push(dates[0]);
              }
              if (dates.length > 1) {
                this.selectedDates.push(dates[dates.length-1]);
              }
            }
          }
        }

      generateCalendar() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        this.calendarDays = [];
        let week: (Date | null)[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
          week.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
          week.push(new Date(year, month, day));
          if (week.length === 7) {
            this.calendarDays.push(week);
            week = [];
          }
        }

        // Add empty cells for days after the last day of the month
        while (week.length < 7 && week.length > 0) {
          week.push(null);
        }
        if (week.length > 0)
          this.calendarDays.push(week);

        // Add extra weeks if needed to display 6 weeks
        while (this.calendarDays.length < 6) {
            this.calendarDays.push(Array(7).fill(null));
        }
      }

      selectDay(day: Date | null) {
        if (!day) return;

        if (this.mode === 'single') {
          this.selectedDates = [day];
          this.select.emit(day);
        } else if (this.mode === 'multiple') {
          const index = this.selectedDates.findIndex(d => d.getTime() === day.getTime());
          if (index > -1) {
            this.selectedDates.splice(index, 1);
          } else {
            this.selectedDates.push(day);
          }
          this.select.emit(this.selectedDates);
        } else if (this.mode === 'range') {
           if (this.selectedDates.length === 0) {
             this.selectedDates = [day];
           }
           else if (this.selectedDates.length === 1)
           {
             if (day.getTime() < this.selectedDates[0].getTime())
             {
               this.selectedDates = [day, this.selectedDates[0]];
             }
             else
             {
                this.selectedDates = [this.selectedDates[0], day];
             }
           }
           else
           {
             this.selectedDates = [day];
           }
          this.select.emit(this.selectedDates.length > 1 ? this.selectedDates : this.selectedDates[0]);
        }
        this.generateCalendar(); // Regenerate to update display
      }

      isDaySelected(day: Date | null): boolean {
        if (!day) return false;
        return this.selectedDates.some(selectedDate =>
          selectedDate.getTime() === day.getTime()
        );
      }

      isDayInRange(day: Date | null): boolean {
        if (!day || this.mode !== 'range' || this.selectedDates.length < 2) return false;
        const start = this.selectedDates[0].getTime();
        const end = this.selectedDates[1].getTime();
        const dayTime = day.getTime();
        return dayTime >= start && dayTime <= end;
      }

      formatDate(date: Date | null, format: string = 'yyyy-MM-dd'): string {
        if (!date) return '';
        return this.datePipe.transform(date, format) || '';
      }

      goToPreviousMonth() {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
        this.generateCalendar();
      }

      goToNextMonth() {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
        this.generateCalendar();
      }
    }

    