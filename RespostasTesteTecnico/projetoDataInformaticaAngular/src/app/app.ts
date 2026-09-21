import { Component } from '@angular/core';
import { UserListComponent } from './features/users/user-list/user-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserListComponent],
  template: `<app-user-list />`,
})
export class App {}