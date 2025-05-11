import { Component, OnInit, OnDestroy, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { Goal } from '../../types';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { Subject } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';

// Define a type for the datepicker value.  This makes things clearer.
type DatePickerValue = Date | null | undefined;

@Component({
    selector: 'app-goals-section',
    templateUrl: './goals-section.component.html',
    styleUrls: ['./goals-section.component.scss'],
    imports: [FormsModule, ModalComponent, CommonModule, DatePipe], // Removed CalendarComponent
})
export class GoalsSectionComponent implements OnInit, OnDestroy {
handleCompleteGoal(arg0: string) {
throw new Error('Method not implemented.');
}
onDateSelect($event: Event) {
throw new Error('Method not implemented.');
}
    goals: Goal[] = [];
    newGoal: Goal = { id: '', name: '', targetDate: undefined, description: '', completed: false };
    isModalOpen = false;
    editingGoal: Goal | null = null;
    selectedDate: DatePickerValue = undefined; // Use the new type
    private destroy$: Subject<void> = new Subject<void>();
    private datePipe: DatePipe;

    // Use ViewChild to get a reference to the input element.
    @ViewChild('dateInput') dateInput: ElementRef<HTMLInputElement> | undefined;

    constructor(@Inject(LOCALE_ID) private locale: string) {
        this.datePipe = new DatePipe(locale);
    }

    ngOnInit(): void {
        this.loadGoals();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    openModal(goal?: Goal) {
        this.isModalOpen = true;
        if (goal) {
            this.editingGoal = { ...goal };
            this.newGoal = {
                ...goal,
                targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
            };
            this.selectedDate = goal.targetDate ? new Date(goal.targetDate) : undefined;
        } else {
            this.editingGoal = null;
            this.newGoal = { id: '', name: '', targetDate: undefined, description: '', completed: false };
            this.selectedDate = undefined;
        }
    }

    closeModal() {
        this.isModalOpen = false;
        this.editingGoal = null;
        this.newGoal = { id: '', name: '', targetDate: undefined, description: '', completed: false };
        this.selectedDate = undefined;
    }

    handleSaveGoal() {
        if (this.newGoal.name && this.newGoal.description) {
            if (this.editingGoal) {
                const index = this.goals.findIndex(g => g.id === this.editingGoal!.id);
                if (index > -1) {
                    this.goals[index] = { ...this.newGoal };
                }
            } else {
                this.newGoal.id = crypto.randomUUID();
                this.goals.push({ ...this.newGoal });
            }
            this.saveGoals();
            this.closeModal();
        } else {
            alert('Please fill in all fields!');
        }
    }

    handleDeleteGoal(id: string): void {
        this.goals = this.goals.filter(goal => goal.id !== id);
        this.saveGoals();
    }

    trackByGoalId(index: number, goal: Goal): string {
        return goal.id;
    }

    saveGoals() {
        const savedGoals = this.goals.map(goal => ({
            ...goal,
            targetDate: goal.targetDate ? goal.targetDate.toISOString() : null,
        }));
        localStorage.setItem('goals', JSON.stringify(savedGoals));
    }

    loadGoals() {
        const savedGoals = localStorage.getItem('goals');
        if (savedGoals) {
            const parsedGoals = JSON.parse(savedGoals);
            this.goals = parsedGoals.map((goal: any) => ({
                ...goal,
                targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined,
            }));
        } else {
            this.goals = [];
        }
    }

    formatDate(date: DatePickerValue): string {
        return date ? this.datePipe.transform(date, 'MMM dd, yyyy') || 'Invalid Date' : 'N/A';
    }

    // New method to handle date input change
    onDateChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        if (value) {
            const parsedDate = new Date(value);
            if (!isNaN(parsedDate.getTime())) { // Check if it's a valid date
                this.newGoal.targetDate = parsedDate;
                this.selectedDate = parsedDate;
            } else {
                this.newGoal.targetDate = undefined;
                this.selectedDate = undefined;
                // Optionally, show an error message to the user
                alert('Invalid date format. Please use a valid date.');
            }
        } else {
            this.newGoal.targetDate = undefined;
            this.selectedDate = undefined;
        }
    }
}

