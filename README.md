# Burgerito - E-commerce Application avec CI/CD

Application Next.js d'e-commerce pour burgers avec pipeline CI/CD complet utilisant GitHub Actions et Ansible.

## 📋 Table des matières

- [Architecture](#architecture)
- [Tests](#tests)
- [Pipelines CI/CD](#pipelines-cicd)
- [Déploiement](#déploiement)
- [Structure du projet](#structure-du-projet)

## 🏗️ Architecture

### Application Next.js

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Backend**: https://node-eemi.vercel.app/api

### Fonctionnalités

- Catalogue de produits (burgers)
- Authentification (login/register)
- Panier d'achat
- Commandes
- Profil utilisateur

## 🧪 Tests

### Tests Unitaires (Jest)

Les tests unitaires sont situés dans `__tests__/unit/` :

- `productService.test.ts` - Tests des services produits
- `authService.test.ts` - Tests des services d'authentification
- `utils.test.ts` - Tests utilitaires basiques

**Commandes** :

```bash
npm run test:unit        # Lancer les tests unitaires
npm run test:watch       # Mode watch
npm run test:coverage    # Avec couverture de code
```

### Tests API (Jest + Supertest)

Les tests API sont situés dans `__tests__/api/` :

- `api.test.ts` - Tests d'intégration des appels API

**Commande** :

```bash
npm run test:api
```

### Tests E2E (Cypress)

Les tests end-to-end sont situés dans `cypress/e2e/` :

- `home.cy.ts` - Tests de la page d'accueil
- `navigation.cy.ts` - Tests de navigation
- `auth.cy.ts` - Tests d'authentification

**Commandes** :

```bash
npm run test:e2e        # Lancer les tests E2E (headless)
npm run test:e2e:open   # Ouvrir Cypress UI
```

## 🔄 Pipelines CI/CD

### Pipeline CI (`.github/workflows/ci.yml`)

Le pipeline CI s'exécute sur chaque push et PR, et inclut :

1. **Lint & Format**
   - ESLint
   - Prettier (vérification)

2. **Tests Unitaires**
   - Exécution des tests Jest
   - Upload des résultats

3. **Tests API**
   - Exécution des tests d'intégration API
   - Upload des résultats

4. **Tests E2E (Cypress)**
   - Build de l'application
   - Démarrage du serveur Next.js
   - Exécution des tests Cypress
   - Upload des vidéos et screenshots

5. **Build**
   - Build de l'application Next.js
   - Upload des artefacts (uniquement si tous les tests passent)

**Test Gating** : Le build et les pipelines CD ne s'exécutent que si tous les tests passent.

### Pipeline CD #1 - Ansible Local (`.github/workflows/deploy-ansible-local.yml`)

Déploiement local avec Ansible :

- Build de l'application
- Installation d'Ansible
- Exécution du playbook en local
- Configuration PM2 et Nginx

**Déclenchement** : Push sur `main` ou workflow_dispatch

### Pipeline CD #2 - GitHub Actions + Ansible (`.github/workflows/deploy-ansible-remote.yml`)

Déploiement sur serveur distant avec Ansible :

- Build de l'application
- Configuration SSH avec secrets GitHub
- Exécution du playbook Ansible sur le serveur distant
- Déploiement automatique

**Secrets requis** :

- `SSH_PRIVATE_KEY` : Clé privée SSH
- `SERVER_IP` : Adresse IP du serveur

**Déclenchement** : Push sur `main` ou workflow_dispatch

### Pipeline CD #3 - GitHub Actions SSH Only (`.github/workflows/deploy-ssh-only.yml`)

Déploiement direct via SSH sans Ansible :

- Build de l'application
- Copie des fichiers via SCP
- Déploiement via SSH (npm ci, pm2 restart, nginx reload)

**Secrets requis** :

- `SSH_PRIVATE_KEY` : Clé privée SSH
- `SERVER_IP` : Adresse IP du serveur
- `SERVER_USER` : Utilisateur SSH (par défaut: ubuntu)

**Déclenchement** : Push sur `main` ou workflow_dispatch

## 🚀 Déploiement

### Prérequis

1. **Serveur Ubuntu/Debian**
   - Node.js 20
   - PM2
   - Nginx
   - Git

2. **Secrets GitHub** (pour CD #2 et #3)
   - `SSH_PRIVATE_KEY` : Clé privée SSH
   - `SERVER_IP` : IP du serveur
   - `SERVER_USER` : Utilisateur SSH

### Déploiement avec Ansible (Local)

```bash
# Installation d'Ansible
sudo apt-get install ansible

# Exécution du playbook
ansible-playbook -i ansible/inventory.yml ansible/deploy.yml --connection=local
```

### Déploiement avec Ansible (Remote)

```bash
# Depuis GitHub Actions (automatique) ou manuellement :
ansible-playbook -i ansible/inventory.yml ansible/deploy.yml \
  --extra-vars "server_ip=VOTRE_IP" \
  --private-key ~/.ssh/id_rsa
```

### Déploiement SSH Direct

Le pipeline CD #3 effectue automatiquement :

1. Build de l'application
2. Copie des fichiers via SCP
3. Installation des dépendances
4. Redémarrage PM2
5. Rechargement Nginx

## 📁 Structure du projet

```
burgerito/
├── .github/
│   └── workflows/
│       ├── ci.yml                      # Pipeline CI
│       ├── deploy-ansible-local.yml    # CD #1
│       ├── deploy-ansible-remote.yml   # CD #2
│       └── deploy-ssh-only.yml         # CD #3
├── ansible/
│   ├── inventory.yml                   # Inventaire Ansible
│   ├── deploy.yml                      # Playbook principal
│   ├── ansible.cfg                     # Configuration Ansible
│   └── templates/
│       ├── ecosystem.config.js.j2      # Template PM2
│       └── nginx.conf.j2               # Template Nginx
├── cypress/
│   ├── e2e/                            # Tests E2E
│   └── support/                        # Support Cypress
├── __tests__/
│   ├── unit/                           # Tests unitaires
│   └── api/                            # Tests API
├── src/                                # Code source Next.js
├── jest.config.js                      # Configuration Jest
├── cypress.config.ts                   # Configuration Cypress
└── package.json                        # Dépendances
```

## 🛠️ Commandes disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement

# Build
npm run build            # Build de production
npm start                # Démarrer le serveur de production

# Tests
npm run test             # Tous les tests
npm run test:unit        # Tests unitaires
npm run test:api         # Tests API
npm run test:e2e         # Tests E2E
npm run test:coverage    # Couverture de code

# Qualité
npm run lint             # ESLint
npm run lint:fix         # ESLint avec auto-fix
npm run format           # Prettier
```

## 📝 Notes importantes

1. **Tests basiques** : Les tests sont volontairement simples pour démontrer l'automatisation dans les pipelines.

2. **Environnement** : L'application utilise l'API externe `https://node-eemi.vercel.app/api`.

3. **Variables d'environnement** :
   - `API_URL` : URL de l'API backend
   - `NODE_ENV` : Environnement (development/production)
   - `PORT` : Port du serveur (défaut: 3000)

4. **PM2** : L'application est gérée par PM2 en production pour la stabilité et le redémarrage automatique.

5. **Nginx** : Configure comme reverse proxy vers l'application Next.js sur le port 3000.

## 🔧 Configuration des secrets GitHub

Pour activer les pipelines CD #2 et #3, configurez les secrets dans GitHub :

1. Allez dans **Settings** > **Secrets and variables** > **Actions**
2. Ajoutez :
   - `SSH_PRIVATE_KEY` : Votre clé privée SSH
   - `SERVER_IP` : L'adresse IP de votre serveur
   - `SERVER_USER` : L'utilisateur SSH (optionnel, défaut: ubuntu)

## 📊 Artefacts CI/CD

Les pipelines génèrent des artefacts :

- **Vidéos Cypress** : Enregistrements des tests E2E
- **Screenshots Cypress** : Captures d'écran en cas d'échec
- **Résultats de tests** : Rapports Jest
- **Build artifacts** : Fichiers de build Next.js

## 🐛 Dépannage

### Tests qui échouent

- Vérifiez que l'API backend est accessible
- Vérifiez les variables d'environnement
- Consultez les logs GitHub Actions

### Déploiement échoue

- Vérifiez les secrets GitHub
- Vérifiez la connectivité SSH
- Vérifiez les logs Ansible/SSH dans GitHub Actions

### PM2 ne démarre pas

- Vérifiez les logs : `pm2 logs burgerito`
- Vérifiez la configuration : `pm2 list`
- Vérifiez les permissions du répertoire

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Cypress Documentation](https://docs.cypress.io/)
- [Ansible Documentation](https://docs.ansible.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Projet réalisé dans le cadre du cours CI/CD Ansible Avancé**
