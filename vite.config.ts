import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // 必须配置 base 为仓库名，否则资源路径会出错
      // 这里的 '/wswangdaiping.github.io/' 是默认情况，如果是 username.github.io 类型的仓库，通常可以使用 '/'
      // 但为了保险，我们使用 ./ 相对路径，或者根据您的具体仓库名调整
      base: './', 
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
