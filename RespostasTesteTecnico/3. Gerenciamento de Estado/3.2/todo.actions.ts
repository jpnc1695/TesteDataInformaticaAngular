// todo.actions.ts
import { createAction, props } from '@ngrx/store';
import { Todo } from './todo.model';

export const loadTodos = createAction('[Todo] Load Todos');

export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const loadTodosError = createAction(
  '[Todo] Load Todos Error',
  props<{ error: string }>()
);

export const toggleTodoComplete = createAction(
  '[Todo] Toggle Todo Complete',
  props<{ id: number }>()
);