import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideRouter, Routes } from '@angular/router';
import { GoalsSectionComponent } from './components/goals-section/goals-section.component';
import { ModalComponent } from './components/modal/modal.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { DatePipe } from '@angular/common';

const routes: Routes = [
  { path: '', component: GoalsSectionComponent }, // Example route
  // Add other routes as needed
];

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, FormsModule),
    provideRouter(routes),
    DatePipe
  ]
};