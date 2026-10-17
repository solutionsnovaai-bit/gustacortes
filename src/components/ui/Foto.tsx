import type { CSSProperties, Ref } from 'react'
import type { Imagem } from '../../config/imagens'

type Props = {
  img: Imagem
  alt?: string
  className?: string
  sizes?: string
  prioridade?: boolean
  style?: CSSProperties
  imgRef?: Ref<HTMLImageElement>
}

/** Imagem em AVIF com reserva em WebP, sempre com largura e altura (nada de pulo de layout). */
export default function Foto({ img, alt = '', className = '', sizes, prioridade = false, style, imgRef }: Props) {
  return <picture>
    <source type="image/avif" srcSet={img.avif} sizes={sizes} />
    <img ref={imgRef} className={className} src={img.webp} sizes={sizes} width={img.largura} height={img.altura} alt={alt} style={style}
      loading={prioridade ? 'eager' : 'lazy'} decoding="async" fetchPriority={prioridade ? 'high' : 'auto'} draggable={false} />
  </picture>
}
