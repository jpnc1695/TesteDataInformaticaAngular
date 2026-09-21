import {
  ChangeDetectionStrategy, Component, EventEmitter, Input,
  OnInit, Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserPayload, PhoneType } from '../../../core/models/user.model';
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
      <div class="bg-white w-full max-w-3xl rounded shadow-2xl p-8 max-h-[90vh] overflow-auto"
           role="dialog" aria-modal="true"
           (click)="$event.stopPropagation()">

        <h2 class="text-base font-semibold text-gray-800 mb-6">
          {{ isEdit ? 'Editar usuário' : 'Adicionar novo usuário' }}
        </h2>

        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">

          <!-- E-mail -->
          <div>
            <input formControlName="email" type="email"
                   placeholder="Usuário (e-mail) *"
                   class="w-full border-0 border-b border-gray-300 focus:border-blue-600
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
                   class="w-full border-0 border-b border-gray-300 focus:border-blue-600
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
                     class="w-full border-0 border-b border-gray-300 focus:border-blue-600
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
                     class="w-full border-0 border-b border-gray-300 focus:border-blue-600
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
                      class="w-full border-0 border-b border-gray-300 focus:border-blue-600
                             focus:ring-0 px-0 py-2 text-sm font-medium uppercase
                             tracking-wide bg-transparent outline-none transition-colors">
                <option value="mobile">CELULAR</option>
                <option value="home">RESIDENCIAL</option>
                <option value="work">COMERCIAL</option>
              </select>
            </div>
          </div>

          <p class="text-xs text-blue-600 pt-1">
            O usuário receberá uma senha provisória para acesso ao sistema por SMS.
          </p>

          <div class="pt-2">
            <button type="submit"
                    [disabled]="form.invalid"
                    class="px-6 py-2 text-sm font-semibold text-white bg-blue-600
                           hover:bg-blue-700 disabled:opacity-50
                           disabled:cursor-not-allowed uppercase rounded transition">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class UserFormModalComponent implements OnInit {

  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<UserPayload>();

  get isEdit() { return !!this.user; }

  // 👇 Genérico <{...}> tipa cada campo do form, incluindo phoneType como PhoneType
  readonly form = new FormGroup({
    email:     new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    name:      new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    cpf:       new FormControl<string>('', { nonNullable: true, validators: [Validators.required, cpfValidator()] }),
    phone:     new FormControl<string>('', { nonNullable: true, validators: [Validators.required, phoneValidator()] }),
    phoneType: new FormControl<PhoneType>('mobile', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnInit(): void {
    if (this.user) {
      this.form.patchValue({
        email:     this.user.email,
        name:      this.user.name,
        cpf:       this.user.cpf,
        phone:     this.user.phone,
        phoneType: this.user.phoneType,   // ✅ valor do usuário, tipo correto
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue() as UserPayload);
  }
}