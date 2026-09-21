import {
  ChangeDetectionStrategy, Component, DestroyRef, inject, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError, debounceTime, distinctUntilChanged, finalize,
  of, startWith, switchMap, tap,
} from 'rxjs';

import { UsersService } from '../../../core/data-access/users.service';
import { User, UserPayload } from '../../../core/models/user.model';
import { UserFormModalComponent } from '../user-form-modal/user-form-modal.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserFormModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Header -->
    <header class="bg-header text-white flex items-center gap-6 px-6 h-14 shadow">
      <button class="p-1 hover:bg-white/10 rounded" aria-label="Menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
             viewBox="0 0 24 24"><path stroke-linecap="round"
             d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      <h1 class="text-base tracking-widest uppercase">Usuários</h1>

      <div class="relative w-80">
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
             fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input [formControl]="filterCtrl"
               placeholder="Pesquisar..."
               class="w-full bg-white text-sm text-ink placeholder-gray-500
                      pl-9 pr-3 py-2 border border-white/40 rounded-sm
                      outline-none focus:border-white" />
      </div>
    </header>

    <!-- Conteúdo -->
    <main class="p-8">
      <h2 class="text-sm text-ink mb-3">Usuários cadastrados</h2>

      @if (loading()) {
        <div class="flex justify-center py-16">
          <div class="w-8 h-8 border-4 border-gray-300 border-t-link rounded-full animate-spin"></div>
        </div>
      } @else if (error()) {
        <div class="bg-white border border-red-200 text-red-700 rounded-sm p-6 text-center">
          <p class="mb-3 text-sm">{{ error() }}</p>
          <button (click)="retry()"
                  class="px-4 py-1.5 text-sm border border-red-400 rounded-sm hover:bg-red-50">
            Tentar novamente
          </button>
        </div>
      } @else if (users().length === 0) {
        <div class="bg-white border border-gray-200 text-muted rounded-sm p-10 text-center text-sm">
          Nenhum usuário encontrado
        </div>
      } @else {
        <ul class="space-y-2">
          @for (u of users(); track u.id) {
            <li class="bg-white border border-gray-200 rounded-sm
                       grid grid-cols-[40px_1fr_2fr_40px] items-center
                       px-4 py-3 hover:shadow-sm transition">
              <div class="flex items-center justify-center text-gray-600">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"/>
                </svg>
              </div>

              <span class="font-semibold text-sm text-ink">{{ u.name }}</span>

              <span class="text-sm text-ink text-center truncate">{{ u.email }}</span>

              <button (click)="openEdit(u)" aria-label="Editar"
                      class="justify-self-end text-gray-600 hover:text-link transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                     viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.86 4.49l2.65 2.65M4 20h4l10-10-4-4L4 16v4Z"/>
                </svg>
              </button>
            </li>
          }
        </ul>
      }
    </main>

    <!-- FAB vermelho -->
    <button (click)="openCreate()" aria-label="Novo usuário"
            class="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-fab text-white
                   shadow-lg hover:brightness-110 active:scale-95 transition
                   flex items-center justify-center">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="3"
           viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>
    </button>

    <!-- Modal -->
    @if (modalOpen()) {
      <app-user-form-modal
        [user]="editing()"
        (close)="closeModal()"
        (save)="onSave($event)" />
    }
  `,
})
export class UserListComponent {
  private readonly service = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);

  readonly filterCtrl = new FormControl('', { nonNullable: true });
  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly modalOpen = signal(false);
  readonly editing = signal<User | null>(null);

  constructor() {
    this.filterCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => { this.loading.set(true); this.error.set(null); }),
      switchMap(term =>
        this.service.list(term).pipe(
          catchError(() => {
            this.error.set('Falha ao carregar usuários.');
            return of([] as User[]);
          }),
          finalize(() => this.loading.set(false)),
        ),
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(list => this.users.set(list));
  }

  retry(): void { this.filterCtrl.setValue(this.filterCtrl.value); }

  openCreate(): void { this.editing.set(null); this.modalOpen.set(true); }
  openEdit(u: User): void { this.editing.set(u); this.modalOpen.set(true); }
  closeModal(): void { this.modalOpen.set(false); this.editing.set(null); }

  onSave(payload: UserPayload): void {
    const current = this.editing();
    const op$ = current
      ? this.service.update(current.id, payload)
      : this.service.create(payload);

    op$.pipe(
      catchError(() => { this.error.set('Erro ao salvar usuário.'); return of(null); }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.closeModal();
      this.filterCtrl.setValue(this.filterCtrl.value);
    });
  }
}