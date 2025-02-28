import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [
    react(),

  ],
  define: {
    'process.env': {}, // Esto crea un objeto vacío para 'process.env'
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  optimizeDeps: {
    include: ['agent-base', 'proxy-agent'],
  },
  build: {
    sourcemap: true, // Usa esta propiedad directamente
    rollupOptions: {
      input: 'index.html',
    },    
    outDir: 'dist',
  },
});
