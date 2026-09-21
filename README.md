# Projeto Data Informática — Angular

Aplicação de **listagem e cadastro de usuários** desenvolvida como desafio técnico, com foco em boas práticas de Angular moderno: **standalone components**, **Signals**, **RxJS**, **Tailwind CSS**, **Angular Material** e **SSR**.

---

## 🚀 Tecnologias

| Stack | Versão |
|---|---|
| Angular | 21.2 |
| TypeScript | 5.9 |
| RxJS | 7.8 |
| Angular Material + CDK | 21.2 |
| Tailwind CSS | 4.3 |
| Vitest | 4.0 |
| SSR (`@angular/ssr` + Express) | 21.2 |
| Zone.js | 0.16 |

---

## 📋 Funcionalidades

### Listagem de usuários
- ✅ Cards/linhas com **nome**, **e-mail** e botão de **editar**
- ✅ Filtro por nome com **debounce de 300ms**
- ✅ Estado de **loading** durante o carregamento
- ✅ Mensagem de **erro** com botão "Tentar novamente"
- ✅ Empty state quando nenhum usuário é encontrado
- ✅ Botão **FAB vermelho** para adicionar novo usuário

### Cadastro e edição (modal)
- ✅ Formulário **reativo** com campos: e-mail, nome, CPF, telefone e tipo de telefone
- ✅ **Validações** por campo com mensagens de erro:
  - E-mail: obrigatório + formato válido
  - Nome: obrigatório
  - CPF: obrigatório + **dígitos verificadores**
  - Telefone: obrigatório + 10 ou 11 dígitos
- ✅ Botão **Salvar desabilitado** enquanto o formulário está inválido
- ✅ **Preenchimento automático** dos campos quando em modo de edição
- ✅ Modal fecha com clique no overlay ou tecla **ESC**

### Requisitos técnicos atendidos
- ✅ **Standalone components** (sem `NgModules`)
- ✅ **Signals** para estado reativo (`users`, `loading`, `error`, `modalOpen`, `editing`)
- ✅ **Operadores RxJS** em uso real: `debounceTime`, `distinctUntilChanged`, `switchMap`, `catchError`, `finalize`, `startWith`, `merge`, `map`, `tap`
- ✅ **Sem memory leaks**: subscriptions gerenciadas com `takeUntilDestroyed`
- ✅ **SSR** habilitado com hidratação no cliente

---

## 🏗️ Estrutura do projeto

```
src/
├── main.ts                              # bootstrap do cliente
├── main.server.ts                       # bootstrap do servidor (SSR)
├── server.ts                            # Express para SSR
├── styles.css                           # Tailwind + estilos globais
├── index.html
└── app/
    ├── app.ts                           # componente raiz
    ├── app.config.ts                    # providers do cliente
    ├── app.config.server.ts             # providers do servidor
    ├── app.routes.ts
    ├── core/
    │   ├── models/
    │   │   └── user.model.ts            # tipos: User, UserPayload, PhoneType
    │   ├── validators/
    │   │   ├── cpf.validator.ts         # validação de CPF
    │   │   └── phone.validator.ts       # validação de telefone
    │   └── data-access/
    │       └── users.service.ts         # CRUD mockado (Signals + RxJS)
    └── features/
        └── users/
            ├── user-list/
            │   └── user-list.component.ts
            └── user-form-modal/
                └── user-form-modal.component.ts
```

---

## 🔧 Pré-requisitos

- **Node.js** 20+ (recomendado 22)
- **npm** 10.9+
- **Angular CLI** 21+ (opcional, para comandos globais)

---

## 📦 Instalação

```bash
# clone o repositório
git clone <url-do-repo>
cd projetoDataInformaticaAngular

# instale as dependências
npm install
```

---

## ▶️ Como rodar

### Desenvolvimento (com SSR)

```bash
npm start
# ou
ng serve
```

Acesse: **http://localhost:4200**

### Build de produção

```bash
npm run build
```

Os artefatos são gerados em `dist/projetoDataInformaticaAngular/`.

### Servir build de produção com SSR

```bash
npm run serve:ssr:projetoDataInformaticaAngular
```

### Watch mode

```bash
npm run watch
```

---

## 🧪 Testes

```bash
# rodar testes unitários
npm test

# rodar com cobertura
npm test -- --coverage
```

A cobertura mínima configurada é de **60%** (linhas, funções, branches e statements).

**Testes incluídos:**
- `users.service.spec.ts` → CRUD e filtro
- `cpf.validator.spec.ts` → validação de CPF
- `user-list.component.spec.ts` → debounce e tratamento de erro

---

## 🎨 Configuração do Tailwind CSS

O projeto usa **Tailwind CSS v4** com PostCSS.

### `.postcssrc.json`
```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### Cores customizadas (`src/styles.css`)
```css
@import "tailwindcss";

@theme {
  --color-header: #6b6b6b;
  --color-ink:    #333333;
  --color-muted:  #8a8a8a;
  --color-fab:    #e53935;
  --color-link:   #1976d2;
}
```

Uso: `bg-header`, `text-ink`, `bg-fab`, `text-link`, etc.

---

## 🧩 Decisões técnicas

### Por que Signals em vez de NgRx?
Para o escopo do projeto, os **Signals do Angular 21** oferecem:
- Reatividade granular sem boilerplate
- Melhor performance com `OnPush`
- Menor curva de aprendizado
- Integração nativa com templates

NgRx seria indicado se houvesse **compartilhamento complexo de estado entre features** ou necessidade de **time-travel debugging** — o que não é o caso.

### Por que RxJS ainda é usado?
Signals são ótimos para **estado**, mas RxJS continua sendo ideal para **fluxos assíncronos com cancelamento**:
- `debounceTime` para o filtro
- `switchMap` para cancelar requisições antigas
- `catchError` + `finalize` para tratar falhas e loading
- `takeUntilDestroyed` para evitar memory leaks

### Por que SSR?
- Melhor **SEO** e **first paint**
- Preparação para cenários reais de produção
- Demonstra domínio de `@angular/ssr`

### Por que modal sem `MatDialog`?
- O protótipo pediu um visual **específico** (campos underline, layout custom)
- Componente próprio dá controle total do estilo com Tailwind
- Testável de forma mais simples (sem dependência de `MatDialogRef`)

---

## 🐛 Troubleshooting

### Erro `NG0908: Angular requires Zone.js`
Certifique-se de que `src/main.ts` tenha `import 'zone.js';` como **primeira linha** e que o `angular.json` tenha:
```json
"polyfills": ["zone.js"]
```

### Erro `Attempted to load invalid Postcss plugin: "tailwindcss"`
Você está usando **Tailwind v4** — o plugin correto é `@tailwindcss/postcss`:
```bash
npm install -D @tailwindcss/postcss
```

### Erro `Unknown at rule @tailwind` no VS Code
Instale a extensão **Tailwind CSS IntelliSense** ou adicione em `.vscode/settings.json`:
```json
{ "css.lint.unknownAtRules": "ignore" }
```

### Erro `Cannot find module 'zone.js'` no SSR
Use `import 'zone.js/node';` no `src/main.server.ts` (não apenas `zone.js`).

---

## 🔮 Melhorias futuras

- [ ] **Máscara automática** de CPF e telefone enquanto o usuário digita
- [ ] **Paginação** na listagem (`MatPaginator`)
- [ ] Trocar mock por **JSON Server** ou **MSW**
- [ ] Migrar para **Nx Monorepo** com libs `feature-users`, `data-access-users`, `ui`
- [ ] **Testes E2E** com Cypress ou Playwright
- [ ] Migrar para **Zoneless Change Detection** (`provideZonelessChangeDetection`)
- [ ] **i18n** com `@angular/localize`

---

## 📚 Referências

- [Angular Signals](https://angular.dev/guide/signals)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Angular Material](https://material.angular.io/)
- [Vitest](https://vitest.dev/)

---

## 👤 Autor

**Seu Nome**
- LinkedIn: [linkedin.com/in/seu-perfil](https://linkedin.com/in/seu-perfil)
- E-mail: seu@email.com

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.
