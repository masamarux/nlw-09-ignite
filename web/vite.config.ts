import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  //adicionei essa env para abrir um navegador diferente do meu principal, só adicionar um arquivo .env com o um parametro BROWSER com o nome do seu navegador
  process.env.BROWSER=loadEnv(mode, process.cwd(), '').BROWSER;

  return {
    plugins: [react()],
    server: {
      open: true,
    },
  }
})
