interface PaginaParams {
  pagina: number;  
  tamanho: number;
}

interface Pagina<T> {
  itens: T[];
  total: number;         
  pagina: number;
  tamanho: number;
  totalPaginas: number;
}

function filtrarEPaginar<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  params: PaginaParams
): Pagina<T> {
  const { pagina, tamanho } = params;

  if (!Number.isInteger(pagina) || pagina < 1) {
    throw new Error('O número da página deve ser um inteiro maior ou igual a 1.');
  }

  if (!Number.isInteger(tamanho) || tamanho < 1) {
    throw new Error('O tamanho da página deve ser um inteiro maior ou igual a 1.');
  }

  const filtrados = data.filter(filterFn);
  const total = filtrados.length;
  const totalPaginas = Math.ceil(total / tamanho);

  const inicio = (pagina - 1) * tamanho;
  const fim = inicio + tamanho;
  const itens = filtrados.slice(inicio, fim);

  return {
    itens,
    total,
    pagina,
    tamanho,
    totalPaginas,
  };
}