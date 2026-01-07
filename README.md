# Golden Sweet Creations — One‑Pager

Site vitrine one‑page (HTML/CSS/JS) pour un chef pâtissier ayant réinventé son art après un diagnostic de diabète, afin de proposer des créations **sans gluten**, **IG bas**, **sans lactose** et **vegan**.

## Lancer en local

Option 1 (simple, Python) :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000`.

Option 2 (n’importe quel serveur statique) :
- Servez le dossier et ouvrez `index.html`.

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
