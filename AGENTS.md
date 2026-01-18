# Diretrizes do Agente - Rebuild Frontend Matteo (V2)

## 1. Objetivo do Projeto e Estética
- **Objetivo:** Uma plataforma voltada para a comunidade do YouTuber de Minecraft "Matteo". Conecta fãs, exibe vídeos e hospeda blogs/quizzes compartilháveis.
- **Estética:** Estilo "Minecraft/Pixel Art" de alta fidelidade.
  - **Design System:** "Minecraft Web Design System" (v1.0.0).
  - **Elementos Chave:** Fontes em bloco ("Press Start 2P", "VT323"), bordas pixeladas rígidas (`box-shadow`), animações "step" estáticas e cores autênticas de Minecraft (Verde, Marrom Terra, Cinza Pedra).
- **Stack:** TanStack Start (SSR), Convex (DB), Better Auth, Tailwind (v4) + Motion.

---

## 2. Comandos e Operações

### Documentação e Pesquisa
- **SEMPRE** use as ferramentas `context7` (`resolve-library-id` e `query-docs`) para recuperar documentação atualizada e exemplos de código de qualquer biblioteca ou framework.
- **NÃO** use pesquisa geral na web para especificidades de API.

### Gerenciador de Pacotes
- **SEMPRE** use `pnpm` ou `pnpx`.

### Build e Lint
- **Instalar:** `pnpm install`
- **Dev:** `pnpm dev`
- **Build:** `pnpm run build`
- **Lint:** `pnpm run lint`

### Fluxo de Verificação (CRÍTICO)
- **Passo 1:** Execute `pnpx convex dev` em segundo plano.
- **Passo 2:** Execute `pnpm dev`.
- **Passo 3:** Verifique localmente via navegador MCP.
- **Passo 4:** Verifique SSR (Exibir código-fonte).

---

## 3. Estilo de Código e Estrutura

### Framework: TanStack Start
- **Roteamento:** Baseado em arquivos em `src/routes/`.
- **SSR:** Use funções `loaders` e `meta`.

### Estética: Minecraft Web Design System
- **Fontes:**
  - Cabeçalhos: "Press Start 2P"
  - Corpo: "VT323"
- **Componentes:**
  - **Navbar:** Navegação global com Logo, Dropdown de Conteúdo, Login.
  - **Hero:** Banners dinâmicos para os vídeos/produtos mais recentes.
  - **Grids:** Layouts masonry para Blogs/Notícias.
  - **Pixel UI:** Use `box-shadow` para bordas. Sem cantos arredondados (`radius-none`).
- **Cores:** Verde (`#55AA55`), Pedra (`#757575`), Terra (`#795548`), Obsidiana (`#121212`).

### Backend: Convex + Better Auth
- **Schema:** Siga `convex/schema.ts` (Usuários, Sessões, Contas).
- **Lógica:** Toda a lógica de negócios nas funções Convex.

---

## 4. Prompts de Subagentes (Novo Projeto)

### Fase 1: Layout Core (Estilo Minecraft)
> "Atue como o Agente de Frontend. Implemente o 'Minecraft Web Design System'.
> 1. Atualize `src/styles.css` com a paleta de cores do Minecraft e as fontes `Press Start 2P`/`VT323`.
> 2. Atualize `src/routes/__root.tsx` com a Navbar Global e o Rodapé (Redes Sociais, Legal).
> 3. Implemente `PixelButton` e `PixelCard` com bordas rígidas e animações em etapas."

### Fase 2: Implementação de Auth
> "Atue como o Agente de Backend. Implemente o Better Auth com Convex.
> 1. Instale `better-auth`.
> 2. Configure `convex/schema.ts`.
> 3. Crie `src/lib/auth.ts` e rotas de API."

### Fase 3: Sistema de Conteúdo (Mundo do Matteo)
> "Atue como o Agente Fullstack. Construa o Hub de Conteúdo.
> 1. Crie `src/routes/index.tsx` com Hero (Último Vídeo), Grid de Conteúdo (Blogs/Quizzes) e Newsletter.
> 2. Implemente o sistema de Blog/Notícias em `src/routes/blog/$slug.tsx`.
> 3. Garanta que todas as páginas estejam prontas para SSR."
