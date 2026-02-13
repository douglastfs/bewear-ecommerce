# HeroBanner — Documentação do Componente

Componente de carousel de banners hero configurável, usando [shadcn/ui Carousel](https://ui.shadcn.com/docs/components/carousel) + [embla-carousel-autoplay](https://www.embla-carousel.com/plugins/autoplay/).

---

## Props

| Prop             | Tipo                | Padrão | Descrição                        |
| ---------------- | ------------------- | ------ | -------------------------------- |
| `slides`         | `HeroBannerSlide[]` | —      | **Obrigatório.** Array de slides |
| `autoplay`       | `boolean`           | `true` | Ativa autoplay automático        |
| `autoplayDelay`  | `number`            | `5000` | Delay entre slides (ms)          |
| `loop`           | `boolean`           | `true` | Loop infinito                    |
| `showIndicators` | `boolean`           | `true` | Exibe dots de paginação          |
| `showArrows`     | `boolean`           | `true` | Exibe setas de navegação         |

### Interface `HeroBannerSlide`

```ts
interface HeroBannerSlide {
  id: number;
  image: string; // caminho da imagem (ex: "/banner-01.png")
  alt: string; // texto alternativo
  cta?: {
    // botão CTA (opcional)
    label: string; // texto do botão
    href: string; // link do botão
  };
}
```

---

## Casos de Uso

### Carousel com autoplay, dots e setas (padrão)

```tsx
import HeroBanner from "@/components/common/hero-banner";

const slides = [
  { id: 1, image: "/banner-01.png", alt: "Leve uma vida com estilo" },
  { id: 2, image: "/banner-02.png", alt: "Seja autêntico" },
];

<HeroBanner slides={slides} />;
```

### Carousel com CTAs

```tsx
const slides = [
  {
    id: 1,
    image: "/banner-01.png",
    alt: "Leve uma vida com estilo",
    cta: { label: "Ver coleção", href: "/colecao" },
  },
  {
    id: 2,
    image: "/banner-02.png",
    alt: "Seja autêntico",
    cta: { label: "Comprar agora", href: "/produtos" },
  },
];

<HeroBanner slides={slides} />;
```

### Carousel sem setas (apenas dots)

```tsx
<HeroBanner slides={slides} showArrows={false} />
```

### Carousel sem dots (apenas setas)

```tsx
<HeroBanner slides={slides} showIndicators={false} />
```

### Carousel sem autoplay (navegação manual)

```tsx
<HeroBanner slides={slides} autoplay={false} />
```

### Carousel com delay customizado (10s)

```tsx
<HeroBanner slides={slides} autoplayDelay={10000} />
```

### Banner estático (1 slide, sem carousel)

```tsx
const slides = [{ id: 1, image: "/banner-01.png", alt: "Banner único" }];

// Renderiza banner estático automaticamente, sem carousel/dots/setas
<HeroBanner slides={slides} />;
```

### Combinando tudo: sem loop, sem setas, delay rápido

```tsx
<HeroBanner
  slides={slides}
  loop={false}
  showArrows={false}
  autoplayDelay={3000}
/>
```

---

## Comportamento

- **1 slide**: renderiza banner estático (sem carousel, dots ou setas)
- **2+ slides**: carousel com autoplay, loop e controles
- **Hover**: pausa autoplay; sair retoma
- **CTA**: botão centralizado na parte inferior da imagem (opcional por slide)
- **Dots**: clicáveis para navegar direto a um slide; dot ativo tem largura maior
- **Setas**: botões circulares semi-transparentes posicionados nas laterais

## Dependências

- `embla-carousel-react` (via `@shadcn/carousel`)
- `embla-carousel-autoplay`
- `lucide-react` (ícones ChevronLeft/ChevronRight)
