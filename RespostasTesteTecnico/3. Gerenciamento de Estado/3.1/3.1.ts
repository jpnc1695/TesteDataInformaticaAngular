import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  output,
  signal,
} from '@angular/core';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarrinhoComponent {
  // Signal com a lista de itens
  readonly itens = signal<ItemCarrinho[]>([
    { id: 1, nome: 'Maçã', preco: 2.5, quantidade: 2 },
    { id: 2, nome: 'Laranja', preco: 1.8, quantidade: 0 },
  ]);

  // Computed com o total (quantidade × preço)
  readonly total = computed(() =>
    this.itens().reduce(
      (soma, item) => soma + item.preco * item.quantidade,
      0
    )
  );

  // Output que emite sempre que o total mudar
  readonly totalMudou = output<number>();

  constructor() {
    // Reage a mudanças no total e emite pelo output
    effect(() => {
      this.totalMudou.emit(this.total());
    });
  }

  adicionar(id: number): void {
    this.itens.update(itens =>
      itens.map(item =>
        item.id === id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  }

  remover(id: number): void {
    this.itens.update(itens =>
      itens.map(item =>
        item.id === id && item.quantidade > 0
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      )
    );
  }

  removerItem(id: number): void {
    this.itens.update(itens => itens.filter(item => item.id !== id));
  }

  adicionarNovoItem(nome: string, preco: number): void {
    this.itens.update(itens => [
      ...itens,
      { id: Date.now(), nome, preco, quantidade: 1 },
    ]);
  }

  limpar(): void {
    this.itens.set([]);
  }
}