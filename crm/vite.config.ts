import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// CRM interno de Datecito. La API vive en el backend Laravel (VITE_API_URL).
export default defineConfig({
  plugins: [react()],
  server: { port: 5175, strictPort: true },
});
