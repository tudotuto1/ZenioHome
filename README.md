# Zenio Home — Guide d'intégration des images

## Structure des fichiers
```
zeniohome/
├── index.html          → Page d'accueil
├── catalogue.html      → Catalogue avec filtres & recherche
├── produit.html        → Page produit (dynamique via ?id=1..10)
├── images/             → (à créer) vos images ici
└── README.md           → Ce guide
```

---

## 🖼️ Remplacer les images — Guide complet

### 1. IMAGE HERO (index.html)
**Localisation :** section `.hero`, div `.hero-image-wrap`

```html
<!-- AVANT (placeholder) -->
<div class="img-placeholder" style="aspect-ratio:4/5;border-radius:3px;">
  ...
</div>

<!-- APRÈS (votre image) -->
<img src="images/hero-main.jpg" alt="Zenio Home - Smart Living" style="aspect-ratio:4/5;border-radius:3px;width:100%;object-fit:cover;">
```
**Taille recommandée :** 800 × 1000px (ratio 4:5)

---

### 2. CATÉGORIES (index.html)
**Localisation :** section `.categories-section`, dans chaque `.cat-card`

```html
<!-- AVANT -->
<div class="cat-placeholder" style="min-height:480px;">🏠</div>

<!-- APRÈS -->
<img src="images/cat-maison-connectee.jpg" alt="Maison Connectée" class="cat-img" style="min-height:480px;object-fit:cover;width:100%;">
```

**Tailles recommandées :**
- Première carte (grande) : 700 × 700px
- Autres cartes : 500 × 300px

---

### 3. PRODUITS — Images emoji
**Partout où vous voyez :** `<div class="product-img-placeholder">🌡️</div>`

```html
<!-- AVANT -->
<div class="product-img-placeholder">🌡️</div>

<!-- APRÈS -->
<img src="images/product-1.jpg" alt="Thermomètre Smart" style="width:100%;height:100%;object-fit:cover;">
```

**Convention de nommage recommandée :**
| Fichier | Produit |
|---------|---------|
| product-1.jpg | Thermomètre Smart |
| product-2.jpg | Ampoule LED RGB |
| product-3.jpg | Mini Aspirateur |
| product-4.jpg | Capteur Humidité |
| product-5.jpg | Diffuseur Mag-Lev |
| product-6.jpg | Prise Connectée |
| product-7.jpg | Lampe Bureau LED |
| product-8.jpg | Balance Cuisine |
| product-9.jpg | Détecteur Fumée |
| product-10.jpg | Caméra 1080p |

**Taille recommandée :** 600 × 600px (carré, ratio 1:1)

---

### 4. SECTION ÉDITORIALE (index.html)
**Localisation :** section `.editorial`

```html
<!-- AVANT -->
<div class="editorial-img-placeholder">🏡</div>

<!-- APRÈS -->
<img src="images/editorial-ambiance.jpg" alt="Zenio Home Ambiance" class="editorial-img" style="width:100%;height:100%;min-height:500px;object-fit:cover;">
```
**Taille recommandée :** 800 × 600px

---

### 5. PAGE PRODUIT — Galerie (produit.html)
La page produit affiche une image principale + 4 thumbnails.

**Image principale :** Cherchez `main-img-placeholder` et remplacez par :
```html
<img src="images/product-1-main.jpg" alt="Thermomètre Smart" id="mainImg" style="width:100%;height:100%;object-fit:cover;">
```

**Thumbnails :** Remplacez les divs `.thumb` par :
```html
<div class="thumb active" onclick="changeMainImg('images/product-1-main.jpg')">
  <img src="images/product-1-thumb1.jpg" style="width:100%;height:100%;object-fit:cover;">
</div>
```

---

### 6. LOGO (optionnel)
Si vous avez un logo fichier `.png` ou `.svg`, remplacez dans les 3 fichiers :
```html
<!-- AVANT -->
<a href="index.html" class="nav-logo">Zenio <span>Home</span></a>

<!-- APRÈS -->
<a href="index.html" class="nav-logo">
  <img src="images/logo.png" alt="Zenio Home" style="height:40px;width:auto;">
</a>
```

---

## 🗂️ Créer le dossier images

```bash
mkdir images
# Placez vos images dans ce dossier
```

---

## ✅ Checklist de mise en ligne

- [ ] Logo remplacé
- [ ] Image hero remplacée
- [ ] Images catégories (5) remplacées
- [ ] Images produits (10+) remplacées
- [ ] Image éditoriale remplacée
- [ ] Noms de produits & prix vérifiés dans le JS de chaque page
- [ ] Liens de navigation mis à jour
- [ ] Paiement configuré (remplacer le bouton "Passer la commande")

---

## 💡 Ajouter de nouveaux produits

Dans chaque fichier, cherchez le tableau `ALL_PRODUCTS` ou `PRODUCTS` dans le `<script>` et ajoutez :

```javascript
{
  id: 11,
  name: "Nom du produit",
  cat: "Catégorie affichée",
  catSlug: "slug-url",       // maison-connectee, eclairage, bureau, bien-etre, cuisine
  price: 29.99,
  oldPrice: null,            // null ou ancien prix
  tag: null,                 // null, "Nouveau" ou "Promo"
  emoji: "🎯",               // utilisé jusqu'à remplacement par image
  desc: "Description courte",
  specs: ["Spec 1", "Spec 2"],
  isNew: false,
  rating: 4.5,
  reviews: 0
}
```
