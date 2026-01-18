# Matteo - Plataforma da Comunidade Minecraft

Uma plataforma dedicada à comunidade do YouTuber de Minecraft **Matteo**, construída com uma estética de alta fidelidade do Minecraft.

## 🧱 Design System
Este projeto segue o **Minecraft Web Design System v1.0.0**, apresentando:
- **UI Pixel Art:** Bordas rígidas, fontes em bloco ("Press Start 2P", "VT323") e animações `steps()`.
- **Componentes:** Banners de Hero dinâmicos, Grids de Conteúdo (Vídeos, Blogs, Quizzes) e formulários pixelados.
- **Tema:** Paleta autêntica do Minecraft (Verde, Terra, Pedra, Obsidiana).

## 🛠️ Stack
- **Framework:** TanStack Start (Server-Side Rendering)
- **Banco de Dados:** Convex
- **Autenticação:** Better Auth
- **Estilo:** Tailwind CSS (v4) + Motion

## 🚀 Começando

1.  **Instalar dependências:**
    ```bash
    pnpm install
    ```

2.  **Iniciar Convex (Backend):**
    ```bash
    npx convex dev
    ```

3.  **Iniciar Servidor de Dev (Frontend):**
    ```bash
    pnpm dev
    ```

## 🏗️ Build para Produção
```bash
pnpm run build
```

## 🧪 Testes e Linting
- Teste: `pnpm test`
- Lint: `pnpm run lint`
