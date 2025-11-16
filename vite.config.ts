import { defineConfig } from 'vite';

// TODO: Configure Vite for your JSX setup
export default defineConfig({
  // Cấu hình esbuild để Vite biết cách xử lý JSX
  // sử dụng các factory functions của chúng ta
  esbuild: {
    jsxFactory: 'createElement',
    jsxFragment: 'createFragment',
  },
  server: {
    port: 3000,
    open: true
  }
});