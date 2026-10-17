import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SEO, SITE } from './src/config/site'

/**
 * Endereço público do site, usado nas tags de compartilhamento (WhatsApp, Instagram, Google).
 * Ordem: VITE_SITE_URL (se você definir) → domínio de produção da Vercel → endereço padrão.
 */
function siteOrigin(mode: string) {
  const env = loadEnv(mode, '.', 'VITE_')
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const raw = env.VITE_SITE_URL || (vercel ? `https://${vercel}` : 'https://gustacortes.vercel.app')
  const url = new URL(raw)
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('VITE_SITE_URL deve usar HTTP ou HTTPS.')
  return url.origin
}

const html = (t: string) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Preenche o index.html e gera o site.webmanifest, robots.txt e sitemap.xml a partir de src/config/site.ts. */
function dadosDoSite(origin: string): Plugin {
  const trocas: Record<string, string> = {
    __SITE_ORIGIN__: origin,
    __NOME__: html(SITE.nome),
    __TITULO__: html(SEO.titulo),
    __DESCRICAO__: html(SEO.descricao),
    __COMPARTILHAR_TITULO__: html(SEO.compartilharTitulo),
    __COMPARTILHAR_TEXTO__: html(SEO.compartilharTexto),
    __IMAGEM_ALT__: html(SEO.imagemAlt),
    __COR_TEMA__: SEO.corTema,
    __COR_FUNDO__: SEO.corFundo,
    __SEM_JS__: html(`${SITE.nome}: barbearia com hora marcada. Agende em ${SITE.agendaExibicao} ou chame no WhatsApp ${SITE.whatsappExibicao}.`),
  }
  const manifesto = JSON.stringify({
    name: SITE.nome, short_name: SITE.nome, lang: 'pt-BR',
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
    theme_color: SEO.corTema, background_color: SEO.corFundo, display: 'standalone',
  }, null, 2)
  return {
    name: 'dados-do-site',
    transformIndexHtml: (h: string) => Object.entries(trocas).reduce((acc, [k, v]) => acc.replaceAll(k, v), h),
    configureServer(server) {
      server.middlewares.use('/site.webmanifest', (_req, res) => { res.setHeader('Content-Type', 'application/manifest+json'); res.end(manifesto) })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'site.webmanifest', source: manifesto })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n` })
      this.emitFile({
        type: 'asset', fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${origin}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><priority>1.0</priority></url>\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const origin = siteOrigin(mode)
  return {
    plugins: [react(), tailwindcss(), dadosDoSite(origin)],
    define: { __SITE_ORIGIN__: JSON.stringify(origin) },
    server: { host: '0.0.0.0', port: 4173, strictPort: true },
    preview: { host: '0.0.0.0', port: 4173 },
    build: { target: 'es2022', sourcemap: false, cssCodeSplit: false },
  }
})
