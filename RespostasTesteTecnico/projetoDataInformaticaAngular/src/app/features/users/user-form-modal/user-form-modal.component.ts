import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserPayload } from '../../../core/models/user.model';
import { cpfValidator } from '../../../core/validators/cpf.validator';
import { phoneValidator } from '../../../core/validators/phone.validator';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed inset-0 z-40 bg-black/25 flex items-center justify-center p-4"
         (click)="close.emit()">
      <div class="bg-white w-full max-w-3xl rounded-sm shadow-2xl p-8"
           role="dialog" aria-modal="true"
           (click)="$event.stopPropagation()">

        <h2 class="text-base font-semibold text-ink mb-6">
          {{ isEdit ? 'Editar usuário' : 'Adicionar novo usuário' }}
        </h2>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">

          <!-- E-mail -->
          <div>
            <input formControlName="email" type="email"
                   placeholder="Usuário (e-mail) *"
                   class="w-full border-0 border-b border-gray-300 focus:border-link
                          focus:ring-0 px-0 py-2 text-sm placeholder-gray-400
                          bg-transparent outline-none transition-colors" />
            @if (form.controls.email.touched && form.controls.email.invalid) {
              <p class="text-xs text-red-600 mt-1">
                @if (form.controls.email.hasError('required')) { E-mail é obrigatório. }
                @else { E-mail inválido. }
              </p>
            }
          </div>

          <!-- Nome -->
          <div>
            <input formControlName="name" type="text"
                   placeholder="Nome completo *"
                   class="w-full border-0 border-b border-gray-300 focus:border-link
                          focus:ring-0 px-0 py-2 text-sm placeholder-gray-400
                          bg-transparent outline-none transition-colors" />
            @if (form.controls.name.touched && form.controls.name.invalid) {
              <p class="text-xs text-red-600 mt-1">Nome é obrigatório.</p>
            }
          </div>

          <!-- CPF / Telefone / Tipo -->
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-5">
              <input formControlName="cpf" type="text" maxlength="14"
                     placeholder="CPF *"
                     class="w-full border-0 border-b border-gray-300 focus:border-link
                            focus:ring-0 px-0 py-2 text-sm placeholder-gray-400
                            bg-transparent outline-none transition-colors" />
              @if (form.controls.cpf.touched && form.controls.cpf.invalid) {
                <p class="text-xs text-red-600 mt-1">
                  @if (form.controls.cpf.hasError('required')) { CPF é obrigatório. }
                  @else { CPF inválido. }
                </p>
              }
            </div>

            <div class="col-span-4">
              <input formControlName="phone" type="tel"
                     placeholder="Número do telefone *"
                     class="w-full border-0 border-b border-gray-300 focus:border-link
                            focus:ring-0 px-0 py-2 text-sm placeholder-gray-400
                            bg-transparent outline-none transition-colors" />
              @if (form.controls.phone.touched && form.controls.phone.invalid) {
                <p class="text-xs text-red-600 mt-1">
                  @if (form.controls.phone.hasError('required')) { Telefone é obrigatório. }
                  @else { Telefone inválido. }
                </p>
              }
            </div>

            <div class="col-span-3">
              <select formControlName="phoneType"
                      class="w-full border-0 border-b border-gray-300 focus:border-link
                             focus:ring-0 px-0 py-2 text-sm font-medium uppercase
                             tracking-wide bg-transparent outline-none transition-colors">
                <option value="mobile">CELULAR</option>
                <option value="home">RESIDENCIAL</option>
                <option value="work">COMERCIAL</option>
              </select>
            </div>
          </div>

          <p class="text-xs text-link pt-1">
            O usuário receberá uma senha provisória para acesso ao sistema por SMS.
          </p>

          <div class="pt-2">
            <button type="submit"
                    [disabled]="form.invalid"
                    class="px-6 py-2 text-sm font-semibold text-white bg-link
                           hover:brightness-110 disabled:opacity-50
                           disabled:cursor-not-allowed uppercase rounded-sm transition">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class UserFormModalComponent {
  private fb = inject(FormBuilder);

  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<UserPayload>();

  get isEdit() { return !!this.user; }

  readonly form = this.fb.nonNullable.group({
    email:     [this.user?.email ?? '',     [Validators.required, Validators.email]],
    name:      [this.user?.name ?? '',      [Validators.required]],
    cpf:       [this.user?.cpf ?? '',       [Validators.required, cpfValidator()]],
    phone:     [this.user?.phone ?? '',     [Validators.required, phoneValidator()]],
    phoneType: [this.user?.phoneType ?? 'mobile', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue() as UserPayload);
  }
}