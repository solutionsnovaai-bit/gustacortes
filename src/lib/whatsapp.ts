import { MENSAGENS, SITE } from '../config/site'

const numero = SITE.whatsapp.replace(/\D/g, '')
export const temWhatsApp = /^\d{12,13}$/.test(numero)

if (import.meta.env.DEV && !temWhatsApp) {
  console.warn('[site] Confira SITE.whatsapp em src/config/site.ts (55 + DDD + número).')
}

/** Link do WhatsApp com a mensagem pronta. */
export function waLink(mensagem: string = MENSAGENS.padrao) {
  const texto = encodeURIComponent(mensagem)
  return temWhatsApp ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`
}

/** Link de agendamento (InBarber). */
export const AGENDA = SITE.agenda
