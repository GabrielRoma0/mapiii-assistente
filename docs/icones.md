# Ícones do PWA (`public/icons/`)

- `app-icon.svg` e `favicon.svg`: cópias de `design-system/assets/logo/`.
- `icon-192.png` e `icon-512.png`: `app-icon.svg` renderizado em PNG (cantos arredondados, fundo transparente fora deles).
- `maskable-512.png` e `apple-touch-icon.png`: o mesmo desenho com o fundo Space Indigo ocupando o quadrado inteiro, porque o Android e o iOS aplicam a própria máscara. A pinha já fica dentro da área segura (círculo de 80%).

Para gerar de novo (precisa do ImageMagick), a partir de uma cópia do SVG sem o bloco `<metadata>`:

```bash
convert -background none -density 384 icone.svg -resize 512x512 -strip -depth 8 icon-512.png
```

Para os dois de fundo inteiro, tire o `rx="128"` do `<rect>` antes de converter.
