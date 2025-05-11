   import { Component } from '@angular/core';
   import { GoalsSectionComponent } from './components/goals-section/goals-section.component';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.scss'],
     
     imports: [GoalsSectionComponent], // Import the GoalsSectionComponent
   })
   export class AppComponent {
saveGoal() {
throw new Error('Method not implemented.');
}
goalForm: any;
addGoal() {
throw new Error('Method not implemented.');
}
     title = 'healthApp';
   }
   