# Rapport de projet CI/CD & Ansible

**Projet Burgerito — Master 2 Développement Fullstack**

---

## 1. Introduction

### But du projet

Le projet consistait à mettre en place une chaîne CI/CD complète autour d’une application Next.js. L’objectif était d’automatiser les tests, le build et le déploiement sur un serveur réel. Un pipeline robuste devait garantir que seul du code testé atteigne la production.

### Environnement

- **Application** : Burgerito (Next.js 16, TypeScript, Tailwind CSS)
- **CI/CD** : GitHub Actions
- **Automatisation serveur** : Ansible
- **Environnement** : Node.js 20, serveur Ubuntu (GCP)
- **Exécution applicative** : PM2
- **Reverse proxy** : Nginx

### Architecture globale

L’ensemble est organisé en deux couches : une partie CI pour la qualité et le build, puis trois approches CD pour le déploiement. Le pipeline CI exécute lint, tests unitaires, tests API, tests E2E et build. Les pipelines CD déploient selon trois stratégies différentes : Ansible en local, Ansible à distance et déploiement direct par SSH sans Ansible.

---

## 2. Partie Technique

### Pipeline CI

Le pipeline CI est décrit dans `.github/workflows/ci.yml`. Il contient cinq jobs : lint, tests unitaires, tests API, tests E2E et build. Chaque job utilise `npm ci` pour installer les dépendances de manière déterministe, à partir du `package-lock.json`.

Le job de build dépend de tous les autres via `needs`. Si un test échoue, le build n’est pas exécuté. Les vidéos Cypress et les rapports de tests sont stockés comme artefacts pour faciliter le débogage en cas d’échec.

### Test gating (blocage du déploiement si les tests échouent)

Les pipelines CD ne se déclenchent plus directement au push. Ils utilisent le déclencheur `workflow_run` pour s’exécuter uniquement après la fin du pipeline CI sur la branche `main`. Une condition `if: github.event.workflow_run.conclusion == 'success'` garantit que le déploiement ne démarre que si tous les tests CI ont réussi. Le lancement manuel (workflow_dispatch) reste possible pour les tests ou déploiements d’urgence.

### Les trois pipelines CD

Le CD #1 (Ansible local) lance le playbook Ansible en mode local sur le runner de GitHub Actions. Il permet de valider le playbook sans serveur distant. Le déploiement cible un dossier temporaire et utilise l’utilisateur `runner` pour éviter l’erreur "failed to look up user ubuntu".

Le CD #2 (GitHub Actions + Ansible) construit l’application, configure SSH avec les secrets GitHub, puis exécute le playbook Ansible contre le serveur de production. Il utilise l’environnement `production` de GitHub pour centraliser les secrets.

Le CD #3 (SSH only) effectue un déploiement direct sans Ansible : build local, copie des fichiers via SCP, puis commandes SSH sur le serveur. Il crée un fichier `ecosystem.config.js` sur le serveur pour PM2 afin de transmettre `API_URL` à l’application au runtime. Les trois CD utilisent le même test gating et ne déploient que si le pipeline CI a réussi.

### Structure Ansible

Le playbook `ansible/deploy.yml` gère l’installation de Node.js, PM2 et Nginx, la copie des fichiers, la configuration et le démarrage de l’application. L’inventaire `ansible/inventory.yml` définit les hôtes locaux et de production.

Les templates Jinja2 (`ecosystem.config.js.j2`, `nginx.conf.j2`) permettent de personnaliser la configuration selon l’environnement. Le script Next.js est lancé directement via `node_modules/.bin/next` au lieu de `npm start` pour s’assurer que les variables d’environnement sont correctement transmises par PM2.

### Logs et captures

Les logs PM2 sont configurés dans `/var/log/pm2/` ou dans `~/.pm2/logs/` selon l’utilisateur. Les logs Nginx se trouvent dans `/var/log/nginx/`. Les artefacts des pipelines GitHub Actions (vidéos Cypress, résultats de tests, build) sont conservés pour analyser les échecs sans reproduire manuellement les tests.

### Configuration SSH et Nginx

La connexion au serveur repose sur une clé privée SSH stockée dans les secrets GitHub. La clé est écrite temporairement sur le runner, puis utilisée pour `scp` et `ssh`. Nginx est configuré comme reverse proxy sur le port 80, avec un proxy vers l’application Next.js sur le port 3000.

---

## 3. Tests

### Tests unitaires

Les tests unitaires (Jest) couvrent les services comme `productService` et `authService`. Ils vérifient la logique métier en isolant le code des appels réseau réels via des mocks. Les tests sont regroupés dans `__tests__/unit/` et lancés avec `npm run test:unit`.

### Tests API

Les tests API utilisent Jest et Supertest pour simuler des requêtes HTTP vers les routes de l’application. Ils vérifient le comportement des endpoints sans UI. La variable `API_URL` est définie dans l’environnement de test pour pointer vers l’API externe.

### Tests E2E

Cypress exécute les tests end-to-end : navigation, page d’accueil, authentification. L’application est construite et démarrée avant les tests, qui s’exécutent contre un serveur réel sur localhost. Chaque exécution génère des vidéos et des captures d’écran en cas d’échec.

### Artefacts Cypress et coverage

Les vidéos et screenshots Cypress sont automatiquement uploadés comme artefacts GitHub Actions. La rétention est limitée à sept jours pour limiter l’espace utilisé. La couverture de code (coverage) peut être activée avec `npm run test:coverage` pour mesurer le taux de code couvert par les tests.

---

## 4. Problèmes & Solutions

### API_URL non disponible au runtime

L’application affichait "undefined/products" au chargement. Les variables d’environnement fournies au build ne sont pas disponibles au runtime dans Next.js pour les requêtes serveur. La solution a été de les passer via `ecosystem.config.js` de PM2 et de lancer Next.js directement (et non via `npm start`) pour que PM2 injecte correctement les variables.

### Heredoc et ecosystem.config.js

Le fichier `ecosystem.config.js` généré par SSH contenait du contenu parasite ("npm ci --production", etc.). Le délimiteur `EOF` du heredoc bash était indenté, donc bash ne le reconnaissait pas et continuait à lire le script. La solution a été d’aligner le délimiteur de fermeture sur la même indentation que le début du bloc `run` pour qu’il soit correctement reconnu.

### next.config.ts et TypeScript en production

Le serveur utilisait `npm ci --production`, donc TypeScript (devDependency) n’était pas installé. Or Next.js doit charger `next.config.ts` au démarrage. Plutôt que d’ajouter TypeScript en dépendance de production, un `next.config.js` en CommonJS a été créé pour supprimer la dépendance à TypeScript au runtime.

### Dossier public non déployé

Le logo et la favicon étaient introuvables car le dossier `public/` n’était pas copié par les workflows CD. En Next.js, les fichiers dans `public/` sont servis à la racine. La solution a été d’ajouter `public` à la commande `scp` du CD #3 et une tâche de synchronisation dans le playbook Ansible pour le CD #2.

### Permissions et utilisateur PM2

Certains fichiers (par exemple `next.config.js`) restaient propriété de root après un déploiement Ansible, bloquant les mises à jour suivantes par `scp` avec un utilisateur non root. La correction manuelle consistait à exécuter `chown` sur les fichiers concernés. Le playbook pourrait être ajusté pour garantir que l’utilisateur de déploiement soit toujours propriétaire.

### become_user et erreur chmod

L’ajout de `become_user` dans une tâche Ansible provoquait une erreur "chmod: invalid mode: A+user:ubuntu:rx:allow" sur le runner GitHub Actions. Ansible utilisait des ACL non supportées. La solution a été de retirer `become_user` pour cette tâche.

### Environnement production et workflows CD #2 et #3

Les pipelines CD #2 et #3 n’apparaissaient pas dans l’onglet Actions. Ils utilisaient `environment: production`, qui impose que cet environnement existe et soit correctement configuré. L’utilisateur devait créer l’environnement "production" dans les paramètres du dépôt et y configurer les secrets pour que les workflows soient exécutables.

### User ubuntu introuvable sur le runner

Le playbook Ansible local échouait avec "failed to look up user ubuntu" car le runner GitHub Actions utilise l’utilisateur `runner`. La solution a été de passer `deploy_user=runner` au playbook via les variables extra et d’utiliser `deploy_user` dans le playbook pour le propriétaire des fichiers et la commande PM2 startup.

---

## 5. Conclusion & Retour d’expérience

### Ce qui a bien fonctionné

Le pipeline CI avec test gating bloque le déploiement si les tests échouent. Les CD s’exécutent uniquement après un CI réussi grâce à `workflow_run`. La séparation en jobs (lint, unit, API, E2E, build) rend les erreurs faciles à localiser. Ansible centralise la configuration serveur et rend le déploiement reproductible. Le CD #3 (SSH seul) offre une approche minimale utile pour comprendre le flux de déploiement sans couche d’abstraction.

### Ce qui a été difficile

La gestion des variables d’environnement au runtime a nécessité plusieurs itérations. Les différences entre le build et le runtime avec Next.js ne sont pas toujours évidentes. Les limitations des heredocs bash dans les workflows YAML ont causé des bugs subtils. La cohabitation entre PM2 lancé en root (Ansible) et en utilisateur (SSH) a créé des conflits de propriété.

### Enseignements

Commencer par la CI avant le CD permet de stabiliser les tests avant d’automatiser le déploiement. Les secrets et les environnements GitHub doivent être configurés avant de tester les pipelines CD. Les logs serveur (PM2, Nginx) sont indispensables pour diagnostiquer les erreurs en production. Enfin, une configuration minimale en production (par exemple `next.config.js` au lieu de `.ts`) réduit les dépendances et les risques d’erreur au démarrage.
