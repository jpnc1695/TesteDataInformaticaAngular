•	Por que usar trackBy melhora a performance e como implementá-lo corretamente??

Sem trackBy, ao recriar a lista o Angular perde a referência dos objetos e destrói/recria todos os nós do DOM, mesmo sem mudança nos dados. Com trackBy (ou track no @for), você informa um identificador único e estável — normalmente o id — e o Angular reaproveita os nós existentes, atualizando só o que mudou.

•	Como ChangeDetectionStrategy.OnPush pode reduzir ciclos desnecessários de detecção neste cenário?

Com OnPush, uma lista com centenas de itens deixa de ser reavaliada a cada evento global e passa a ser reavaliada apenas quando ela mesma ou um item específico realmente mudou — o custo deixa de ser proporcional ao tamanho da lista e passa a ser proporcional ao que mudou.


•	Qual seria o impacto de usar a estratégia Default neste caso ?  

Com Default, o Angular reavalia todos os componentes e bindings a cada ciclo de change detection, sem pular nenhum. Numa lista com centenas de itens, cada evento global (clique, HTTP, setTimeout) força a verificação de todas as linhas, mesmo as inalteradas. O custo cresce linearmente com o tamanho da lista, causando jank em scroll, digitação e animações. Diferente do OnPush, o Default não aproveita imutabilidade para pular subárvores. Em resumo: Default é aceitável para listas pequenas, mas inviável para centenas de itens.