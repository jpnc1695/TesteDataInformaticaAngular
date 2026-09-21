import { Injectable, signal } from '@angular/core';
import { Observable, delay, map, of, throwError } from 'rxjs';
import { User, UserPayload } from '../models/user.model';

const SEED: User[] = [
  { id: '1', name: 'Giana Sandrini', email: 'giana@attornatus.com.br',
    cpf: '52998224725', phone: '11987654321', phoneType: 'mobile' },
  { id: '2', name: 'Bruno Costa', email: 'bruno@attornatus.com.br',
    cpf: '11144477735', phone: '1133224455', phoneType: 'home' },
  { id: '3', name: 'Carla Souza', email: 'carla@attornatus.com.br',
    cpf: '39053344705', phone: '11912345678', phoneType: 'work' },
];

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly _users = signal<User[]>(SEED);
  readonly users = this._users.asReadonly();

  list(filter = ''): Observable<User[]> {
    const term = filter.trim().toLowerCase();
    return of(this._users()).pipe(
      delay(500),
      map(list => term ? list.filter(u => u.name.toLowerCase().includes(term)) : list),
    );
  }

  create(payload: UserPayload): Observable<User> {
    const user: User = { ...payload, id: crypto.randomUUID() };
    this._users.update(list => [...list, user]);
    return of(user).pipe(delay(300));
  }

  update(id: string, payload: UserPayload): Observable<User> {
    const current = this._users().find(u => u.id === id);
    if (!current) return throwError(() => new Error('Usuário não encontrado'));
    const updated: User = { ...current, ...payload };
    this._users.update(list => list.map(u => u.id === id ? updated : u));
    return of(updated).pipe(delay(300));
  }
}