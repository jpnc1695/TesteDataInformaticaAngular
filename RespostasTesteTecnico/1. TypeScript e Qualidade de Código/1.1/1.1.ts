class Produto {
  id: number;
  descricao: string;
  quantidadeEstoque: number;

  constructor(id: number, descricao: string, quantidadeEstoque: number) {
    this.id = id;
    this.descricao = descricao;
    this.quantidadeEstoque = quantidadeEstoque;
  }
}

class Verdureira {
  produtos: Produto[];

  constructor() {
    this.produtos = [
      new Produto(1, 'Maçã', 20),
      new Produto(2, 'Laranja', 0),
      new Produto(3, 'Limão', 20)
    ];
  }

  getDescricaoProduto(produtoId: number): string {
    const produto = this.produtos.find(p => p.id === produtoId);

    if (!produto) {
      throw new Error(`Produto com id ${produtoId} não encontrado.`);
    }

    return `${produto.id} - ${produto.descricao} (${produto.quantidadeEstoque}x)`;
  }

  hasEstoqueProduto(produtoId: number): boolean {
    const produto = this.produtos.find(p => p.id === produtoId);

    if (!produto) {
      throw new Error(`Produto com id ${produtoId} não encontrado.`);
    }

    return produto.quantidadeEstoque > 0;
  }
}

  Melhorias realizadas:
  - Adicionei tipos explícitos para as propriedades e parâmetros da classe Produto.
  - Substituí o loop for por métodos de array como find() para melhorar a legibilidade.
  - Adicionei verificações de nulidade para evitar erros caso o produto não seja encontrado.
  - Usei template literals para construir a string de descrição do produto.
  - Usar === em vez de == para comparação de igualdade estrita.
  - Simplificar retorno booleanos.

  