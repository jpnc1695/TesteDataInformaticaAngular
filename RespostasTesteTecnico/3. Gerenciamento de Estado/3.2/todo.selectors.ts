// todo.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

export const selectTodoState =
  createFeatureSelector<TodoState>('todos');

export const selectAllTodos = createSelector(
  selectTodoState,
  (state: TodoState) => state.todos
);

export const selectPendingTodos = createSelector(
  selectAllTodos,
  (todos) => todos.filter(todo => !todo.concluido)
);

export const selectLoading = createSelector(
  selectTodoState,
  (state: TodoState) => state.loading
);

export const selectError = createSelector(
  selectTodoState,
  (state: TodoState) => state.error
);