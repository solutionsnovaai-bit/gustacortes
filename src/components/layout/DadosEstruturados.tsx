import { INSTAGRAM_URL, SEO, SITE, TEM_ENDERECO } from '../../config/site'
import { GRUPOS } from '../../content/servicos'
import { temWhatsApp } from '../../lib/whatsapp'

/** Dados para o Google entender o negócio (barbearia), com a tabela de serviços e preços. */
export default function DadosEstruturados() {
  const precos = GRUPOS.flatMap(g => g.itens.map(s => s.preco))
  const dados: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BarberShop',
    name: SITE.nome,
    description: SEO.descricao,
    url: `${__SITE_ORIGIN__}/`,
    image: `${__SITE_ORIGIN__}/og.jpg`,
    logo: `${__SITE_ORIGIN__}/icon-512.png`,
    priceRange: `R$ ${Math.min(...precos)} – R$ ${Math.max(...precos)}`,
    currenciesAccepted: 'BRL',
    potentialAction: { '@type': 'ReserveAction', target: SITE.agenda, name: 'Agendar horário' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tabela de serviços',
      itemListElement: GRUPOS.map(g => ({
        '@type': 'OfferCatalog',
        name: g.titulo,
        itemListElement: g.itens.map(s => ({
          '@type': 'Offer', price: s.preco.toFixed(2), priceCurrency: 'BRL',
          itemOffered: { '@type': 'Service', name: s.nome },
        })),
      })),
    },
  }
  if (TEM_ENDERECO) {
    const e = SITE.endereco
    dados.address = { '@type': 'PostalAddress', streetAddress: e.rua, addressLocality: e.cidade, addressRegion: e.uf, addressCountry: 'BR', postalCode: e.cep }
  }
  if (temWhatsApp) dados.telephone = `+${SITE.whatsapp.replace(/\D/g, '')}`
  if (INSTAGRAM_URL) dados.sameAs = [INSTAGRAM_URL]
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }} />
}
