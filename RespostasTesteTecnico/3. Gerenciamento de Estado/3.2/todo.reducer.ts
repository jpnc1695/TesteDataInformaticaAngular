// todo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {
  loadTodos,
  loadTodosSuccess,
  loadTodosError,
  toggleTodoComplete,
} from './todo.actions';
import { Todo } from './todo.model';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const todoReducer = createReducer(
  initialState,

  on(loadTodos, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false,
    error: null,
  })),

  on(loadTodosError, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(toggleTodoComplete, (state, { id }) => ({
    ...state,
    todos: state.todos.map(todo =>
      todo.id === id
        ? { ...todo, concluido: !todo.concluido }
        : todo
    ),
  }))
);