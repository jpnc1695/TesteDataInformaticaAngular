import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
class PessoaService {
  /** @description Mock de uma busca em API com retorno em 0.5 segundos */
  buscarPorId(id: number) {
    return of({ id, nome: 'João' }).pipe(delay(500));
  }
}

@Component({
  selector: 'app-root',
  providers: [PessoaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>{{ texto }}</h1>`,
})
export class AppComponent implements OnInit, OnDestroy {
  texto: string = '';
  contador = 0;
  subscriptionBuscarPessoa?: Subscription;
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(
    private readonly pessoaService: PessoaService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subscriptionBuscarPessoa = this.pessoaService
      .buscarPorId(1)
      .subscribe((pessoa) => {
        this.texto = `Nome: ${pessoa.nome}`;
        this.cdr.markForCheck(); // <- avisa o Angular para checar este componente
      });

    this.intervalId = setInterval(() => {
      this.contador++;
      this.cdr.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subscriptionBuscarPessoa?.unsubscribe();
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }
}


Melhorias realizadas e explicações
- Injetei ChangeDetectorRef no construtor. Com ChangeDetectionStrategy.OnPush, o Angular só verifica o componente em eventos do template, mudança de @Input, emissão de pipe async ou chamada explícita a markForCheck()/detectChanges(). Sem isso, a atribuição a this.texto dentro do callback assíncrono não dispara re-renderização — por isso o nome não aparecia.

- Adicionei this.cdr.markForCheck() dentro da subscription. Marca o componente (e seus ancestrais) como “sujo”, garantindo que ele seja verificado no próximo ciclo de change detection disparado pelo setTimeout interno do delay(500).

- Adicionei this.cdr.markForCheck() também dentro do setInterval. Mantém o comportamento consistente para o contador sob OnPush, caso ele venha a ser exibido no template.

- Tipagem explícita nas propriedades. Troquei texto: string sem inicialização por texto: string = '' (com strictPropertyInitialization isso evita erro) e declarei subscriptionBuscarPessoa?: Subscription e intervalId?: ReturnType<typeof setInterval> em vez de deixá-los implícitos.

- Armazenei o retorno do setInterval em intervalId. Permite limpar o timer no ngOnDestroy e evita o vazamento de memória/execução contínua após a destruição do componente. O setInterval não foi removido, conforme solicitado.

- Completei o ngOnDestroy. Fiz o unsubscribe() da subscription (com optional chaining ?.) e o clearInterval do timer, evitando memory leaks.

- Mantive ChangeDetectionStrategy.OnPush, PessoaService e o setInterval intactos. A correção se concentrou apenas na notificação do Angular via ChangeDetectorRef, respeitando todas as restrições do enunciado.