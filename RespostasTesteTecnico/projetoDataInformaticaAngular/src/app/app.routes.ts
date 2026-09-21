import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () =>
      import('./features/users/user-list/user-list.component')
        .then(m => m.UserListComponent) },
];