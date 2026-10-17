# Gusta Cortes

Site da barbearia Gusta Cortes: letreiro de neon que acende peça por peça na abertura, tabela de valores com link direto para a agenda (InBarber) e balão do WhatsApp.

Feito com Vite, React, TypeScript, Tailwind CSS e Motion.

## Onde mudar cada coisa

| O quê | Arquivo |
| --- | --- |
| WhatsApp, link da agenda, Instagram, endereço | `src/config/site.ts` |
| Serviços e preços | `src/content/servicos.ts` |
| Textos das seções | `src/content/textos.ts` |
| Imagens (heros, itens, letreiro) | `public/` e `src/config/imagens.ts` |

O endereço fica escondido enquanto `SITE.endereco.rua` estiver vazio. Se o link da agenda mudar, gere de novo o QR code em `src/content/qr.ts`.

## Rodar no computador

```bash
npm install
npm run dev      # http://localhost:4173
npm run build    # gera a pasta dist
```

## Publicar na Vercel

Importe o repositório na Vercel. Ela detecta o Vite sozinha: comando `npm run build`, pasta `dist`.
Para usar um domínio próprio nas imagens de compartilhamento, defina `VITE_SITE_URL` (ex.: `https://gustacortes.com.br`).
