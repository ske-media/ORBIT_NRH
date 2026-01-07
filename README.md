# Golden Sweet Creations — Site vitrine (One‑Pager)

Site vitrine one‑page (HTML/CSS/JS) pour un **chef pâtissier** ayant réinventé son art après un diagnostic de diabète, afin de proposer des créations **sans gluten**, **IG bas**, **sans lactose** et **vegan** — sans compromis sur le goût.

## Objectifs

- **Raconter l’histoire** du chef (résilience, excellence, nouvelle mission).
- **Présenter les créations** (pains, brioches, tartelettes, cookies, cupcakes).
- **Mettre en avant l’approche “healthy”** (ingrédients naturels, substitutions, régimes).
- **Faciliter la conversion** (CTA vers commande + inscription newsletter).

## Lancer en local

Option (simple, Python) :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000`.

## Fichiers

- `index.html` : structure du one‑pager + contenus + SEO (Open Graph / Twitter / JSON‑LD)
- `styles.css` : thème bordeaux premium, panel crème, responsive
- `script.js` : menu mobile, carrousel témoignages, toast newsletter, année auto
- `robots.txt` / `sitemap.xml` : SEO technique (à adapter au domaine réel)
- `manifest.webmanifest` / `favicon.svg` : PWA légère + favicon

## SEO — points à adapter avant mise en ligne

- **Domaine** : remplacez `https://goldensweetcreations.fr/` dans `index.html`, `robots.txt`, `sitemap.xml` par votre vrai domaine.
- **Réseaux sociaux** : remplacez les liens “démo” dans le footer + le champ `sameAs` du JSON‑LD.
- **Images** : pour de meilleures performances/SEO, hébergez des images locales optimisées (WebP/AVIF) et mettez à jour les URLs.

