import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    devtools(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss({
      config: {
        theme: {
          extend: {
            screens: {
              '3xl': '1920px',  // Full HD
              '4xl': '2560px',  // 1440p/4K
              'tv': '3840px',   // 4K TV
            },
          },
        },
      },
    }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
