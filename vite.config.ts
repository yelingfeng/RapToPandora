import { loadEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport from 'vite-plugin-style-import'
import { injectHtml } from 'vite-plugin-html'
import path from 'path'

// @ts-ignore
export default ({ mode }) => {
  const base = loadEnv(mode, process.cwd()).VITE_APP_ENV === 'production' ? '/RapToPandora/' : '/'

  return defineConfig({
    plugins: [
      vue(),
      injectHtml({
        injectData: {
          // html usage: <%= VITE_APP_ENV %>
          VITE_APP_ENV: loadEnv(mode, process.cwd()).VITE_APP_ENV,
          // injectScript: '<script src="./inject.js"></script>'
        },
      }),
      styleImport({
        libs: [
          {
            libraryName: 'ant-design-vue',
            esModule: true,
            resolveStyle: (name) => {
              return `ant-design-vue/es/${name}/style/css`
            },
          },
        ],
      }),
    ],
    base,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      proxy: {
        // 选项写法
        '/RAP': {
          target: 'http://172.17.20.226:8010',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/RAP/, ''),
        },
      },
    },
  })
}
