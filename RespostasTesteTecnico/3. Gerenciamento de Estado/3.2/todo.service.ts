// todo.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Todo } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private readonly http: HttpClient) {}

  // Mock — em produção seria this.http.get<Todo[]>('/api/todos')
  getTodos(): Observable<Todo[]> {
    return of<Todo[]>([
      { id: 1, titulo: 'Estudar NgRx', concluido: false },
      { id: 2, titulo: 'Escrever testes', concluido: true },
      { id: 3, titulo: 'Revisar PR', concluido: false },
    ]).pipe(delay(800));
  }
}