import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O front-end chama a API pela URL absoluta definida em src/api/http.js,
// por isso não há proxy: prefixos como /events e /dashboard são rotas do React.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
