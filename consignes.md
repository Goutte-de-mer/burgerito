# Projet e-commerce & Admin – Organisation complète

## Projet e-commerce (Front Office)

### Fonctionnalités principales

- **Ajout au panier :**
  - Quand un produit est ajouté, ouvrir un **mini-panier** (dialogue) juste sous l’icône panier.
  - Le dialogue affiche :
    - Liste des articles (image, titre, quantité, prix)
    - Total
    - Boutons : _Aller au paiement_ ou _Voir le panier complet_
  - Les **quantités doivent être modifiables directement** dans ce dialogue.

- **Chat Support :**
  - Widget fixe en bas à droite.
  - Le client peut ouvrir et discuter avec le support en temps réel.

---

## Projet Admin (Back Office)

- **Application séparée Next.js**
  - Créer un **deuxième projet Next.js** pour l’interface d’administration.
- **Authentification admin :**
  - Mettre en place un **login sécurisé**.
- **Gestion des commandes :**
  - Afficher la liste des commandes.
  - Permettre de modifier leur statut (initialement via SSE → **abandonné**).
- **Console Support :**
  - Les admins peuvent répondre aux clients en temps réel dans le chat.

---

## API Node.js (Endpoints)

Base URL : `https://node-eemi.vercel.app/api`

### Auth

- `POST /api/auth/register` → renvoie `{ token, user }`
- `POST /api/auth/login` → renvoie `{ token, user }`
- `GET /api/auth/me` (protégé) → renvoie `{ user }`

### Produits

- `GET /api/products` → `{ items: Product[] }` (tous les produits : disponibles et indisponibles)
- `GET /api/products/:id` → renvoie un `Product`

### Commandes

- `POST /api/orders` (protégé)  
  Body : `{ items: string[] }` (liste d’IDs produit)  
  Réponse : `{ order, items }`
- `GET /api/orders/me` (protégé) → `{ items: Order[] }`
- `GET /api/orders/:id` (protégé propriétaire/admin) → `{ order, items }`

---

## Ressources

- **Code API Node.js :** https://github.com/alagh697/node-eemi
- **Maquette Figma :** https://www.figma.com/design/aYqmWHRy6rz0zJfZEifIsG/Untitled?node-id=0-1&p=f
- **Docs PDF :**
  - _Burger shop - Angular.pdf_ (référence Angular)
  - _Projet fil rouge - NextJS + temps réel avancé EEMI.pdf_ (référence Next.js)

---

## Plan de développement (Next.js)

### Sprints

1. **Sprint 1 : Squelette & Catalogue**
   - Structure App Router + layout (header, liens)
   - Accueil (liste produits via API)
   - Page détail produit `/product/[id]`
   - Gestion 404 + loading  
     **Livrable :** Navigation + produits affichés

2. **Sprint 2 : Auth & Panier**
   - NextAuth (Credentials)
   - Pages inscription / connexion
   - Panier persistant via cookies/session (Server Actions)
   - Middleware : protection panier / checkout  
     **Livrable :** Connexion + gestion panier

3. **Sprint 3 : Commande & Profil**
   - Checkout → création commande → page confirmation
   - Profil utilisateur avec historique commandes
   - Optimisations (next/image, ISR, loading/error)  
     **Livrable :** Passage commande + historique

4. **Sprint 4 : Chat temps réel (WebSocket)**
   - Endpoint `/api/socket` (serveur WebSocket avec `wss`)
   - Client : composant “ChatSupport” (bouton bas droite → ouvre chat)
   - Messages échangés en temps réel (broadcast minimal)
   - Chaque utilisateur peut contacter le support ou canal général  
     **Livrable :** Chat fonctionnel entre utilisateurs et support

5. **Sprint 5 : Finitions**
   - Design conforme à la maquette
   - Accessibilité (labels, focus, contrastes)
   - Gestion cas limites (stock épuisé, erreurs API)
   - Démo finale : parcours complet (Connexion → Ajout → Panier → Checkout → Confirmation → Historique → Chat)  
     **Livrable :** Application complète avec chat temps réel

---

## Barème (Next.js)

- Respect maquette (fidélité visuelle, cohérence design) : **2 pts**
- Structure & organisation projet (App Router, architecture claire) : **2 pts**
- Pages principales (Catalogue, Détail produit, Panier, Checkout, Profil, Chat) : **3 pts**
- Authentification & middleware : **2 pts**
- Gestion panier & commandes (logique, persistance, API) : **3 pts**
- Optimisation (SSR, ISR, next/image, gestion erreurs/loading) : **2 pts**
- Chat temps réel avec WebSocket (fonctionnel & intégré) : **2 pts**
- Qualité du code (lisibilité, conventions, propreté) : **1 pt**

---

## Endpoints Angular (extraits du PDF)

Base URL : `https://node-eemi.vercel.app/api`

### Auth

- `POST /api/auth/register` → renvoie `{ token, user }`
- `POST /api/auth/login` → renvoie `{ token, user }`
- `GET /api/auth/me` (protégé) → renvoie `{ user }`

### Produits

- `GET /api/products` → renvoie `{ items: Product[] }` (tous les produits : disponibles et indisponibles)
- `GET /api/products/:id` → renvoie un `Product`

### Commandes

- `POST /api/orders` (protégé)  
  Body : `{ items: string[] }` (liste d’IDs produit)  
  Réponse : `{ order, items }`
- `GET /api/orders/me` (protégé) → `{ items: Order[] }`
- `GET /api/orders/:id` (protégé propriétaire/admin) → `{ order, items }`

---
