// todo.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { todoReducer } from './todo.reducer';
import { TodoEffects } from './todo.effects';
import { TodoListComponent } from './todo-list.component';

@NgModule({
  declarations: [
    TodoListComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('todos', todoReducer),
    EffectsModule.forFeature([TodoEffects]),
  ],
})
export class TodoModule {}