import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function universalAiProxyPlugin(): Plugin {
  return {
    name: 'universal-ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/proxy', async (req, res) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-target-url');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }

        const targetUrl = req.headers['x-target-url'] as string;
        if (!targetUrl) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing x-target-url header' }));
          return;
        }

        const chunks: Uint8Array[] = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        const bodyBuffer = Buffer.concat(chunks);

        try {
          const authHeader = req.headers['authorization'];
          const fetchHeaders: Record<string, string> = {
            'Content-Type': (req.headers['content-type'] as string) || 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          };
          if (authHeader) {
            fetchHeaders['Authorization'] = authHeader;
          }
          if (targetUrl.includes('openrouter.ai')) {
            fetchHeaders['HTTP-Referer'] = 'http://localhost:3000';
            fetchHeaders['X-Title'] = 'OpenBook Composer';
          }

          const fetchOptions: RequestInit = {
            method: req.method || 'POST',
            headers: fetchHeaders,
          };
          if (req.method !== 'GET' && req.method !== 'HEAD' && bodyBuffer.length > 0) {
            fetchOptions.body = bodyBuffer;
          }

          const response = await fetch(targetUrl, fetchOptions);
          res.statusCode = response.status;
          res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');

          const responseArrayBuffer = await response.arrayBuffer();
          res.end(Buffer.from(responseArrayBuffer));
        } catch (err: any) {
          console.error('[Universal Proxy Error]', err);
          res.statusCode = 502;
          res.end(JSON.stringify({ error: `Proxy failed to connect to ${targetUrl}: ${err.message}` }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), universalAiProxyPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
