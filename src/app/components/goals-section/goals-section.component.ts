import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, Output, EventEmitter, Input } from '@angular/core';
import { Goal } from '../../types';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


// --- Dummy Components ---
// These are placeholders.  In your actual application, these should be
// the real components, and they should be standalone if you are using Angular 14+
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
  standalone: true, // Add this
  imports: [CommonModule],
})
export class ModalComponent {
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
  standalone: true, // Add this
  imports: [CommonModule],
  providers: [DatePipe]
})
export class CalendarComponent {
  @Input() selected: Date | undefined;
  @Output() select = new EventEmitter<Date | undefined>();

  constructor(private datePipe: DatePipe) {}

  onDateChange(event: any) {
    const date = event.target.value ? new Date(event.target.value) : undefined;
        this.select.emit(date);
  }
}
// --- End Dummy Components ---

@Component({
  selector: 'app-goals-section',
  templateUrl: './goals-section.component.html',
  // styleUrls: ['./goals-section.component.css'], // Remove styleUrls
  providers: [DatePipe],
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, CalendarComponent], // Import  the dummy components
})
export class GoalsSectionComponent implements OnInit, OnDestroy {
  goals: Goal[] = [];
  isModalOpen = false;
  editingGoal: Goal | null = null;
  newGoal: Omit<Goal, 'id' | 'completed'> = { name: '', targetDate: undefined, description: '' };
  private destroy$ = new Subject<void>();

  constructor(
    private datePipe: DatePipe,
    @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadGoals();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadGoals(): void {
    if (typeof window !== 'undefined') {
      const savedGoals = localStorage.getItem('fitnessGoals');
      this.goals = savedGoals ? JSON.parse(savedGoals) : [];
    }
  }

  saveGoals(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fitnessGoals', JSON.stringify(this.goals));
    }
  }

  openModal(goal?: Goal) {
    if (goal) {
      this.editingGoal = goal;
      this.newGoal = {
        name: goal.name,
        targetDate: goal.targetDate,
        description: goal.description,
      };
    } else {
      this.editingGoal = null;
      this.newGoal = { name: '', targetDate: undefined, description: '' };
    }
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleSaveGoal() {
    if (!this.newGoal.name.trim()) return;

    if (this.editingGoal) {
      // Update existing goal
      this.goals = this.goals.map((g) => {
        if (g.id === this.editingGoal?.id) {
          return { ...this.editingGoal, ...this.newGoal };
        }
        return g;
      });
    } else {
      // Add new goal
      const goal: Goal = {
        id: crypto.randomUUID(),
        ...this.newGoal,
        completed: false,
      };
      this.goals = [...this.goals, goal];
    }
    this.saveGoals();
    this.closeModal();
    this.cdr.detectChanges();
  }

  handleDeleteGoal(id: string) {
    this.goals = this.goals.filter((g) => g.id !== id);
    this.saveGoals();
    this.cdr.detectChanges();
  }

  handleCompleteGoal(id: string) {
    this.goals = this.goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    this.saveGoals();
    this.cdr.detectChanges();
  }

  onDateSelect(date: Date | undefined) {
    this.newGoal.targetDate = date;
  }

  trackByGoalId(index: number, goal: Goal): string {
    return goal.id;
  }

  formatDate(date: Date | undefined, format: string = 'yyyy-MM-dd'): string {
    if (!date) return '';
    return this.datePipe.transform(date, format) || '';
  }
}

