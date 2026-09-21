// todo.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TodoService } from './todo.service';
import {
  loadTodos,
  loadTodosSuccess,
  loadTodosError,
} from './todo.actions';

@Injectable()
export class TodoEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly todoService: TodoService
  ) {}

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTodos),
      switchMap(() =>
        this.todoService.getTodos().pipe(
          map(todos => loadTodosSuccess({ todos })),
          catchError(error =>
            of(
              loadTodosError({
                error: error?.message ?? 'Erro ao carregar tarefas',
              })
            )
          )
        )
      )
    )
  );
}