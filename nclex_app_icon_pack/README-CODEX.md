# NCLEX Bilingual Prep App Icon Pack

Drop these files into the Vite `public/` directory, then wire them in `index.html`.

Recommended `index.html` additions/updates:

```html
<link rel="icon" href="/nclex-bilingual-prep/favicon.ico" sizes="any" />
<link rel="icon" type="image/png" sizes="32x32" href="/nclex-bilingual-prep/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/nclex-bilingual-prep/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/nclex-bilingual-prep/apple-touch-icon.png" />
<link rel="manifest" href="/nclex-bilingual-prep/manifest.webmanifest" />
<meta name="theme-color" content="#0b55c8" />
```

Use the full-bleed source (`nclex-app-icon-fullbleed-1024.png`) as the canonical design source. The original generated PNG is included only for reference.

After patching, run:

```sh
npm run build
```

Then test on iPhone Safari: open the GitHub Pages URL, Share → Add to Home Screen, and confirm the icon appears on the Home Screen.
