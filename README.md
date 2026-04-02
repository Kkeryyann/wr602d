# WR602D - PDF Faktory Project

Job-Faël BABALOLA TP B - mmi23f01

## Table des matières

- [Stack technique](#stack-technique)
- [Installation](#installation)
    - [Prérequis](#prérequis)
    - [Étapes d'installation](#étapes-dinstallation)
    - [Installation avec Docker](#installation-avec-docker)
- [Configuration](#configuration)
    - [Variables d'environnement](#variables-denvironnement-envlocal)
- [Fonctionnalités](#fonctionnalités)
    - [Conversion PDF](#conversion-pdf)
    - [Abonnements et Stripe](#abonnements-et-stripe)
    - [Génération de PDF (Gotenberg)](#génération-de-pdf-gotenberg)
- [Rôles et permissions](#rôles-et-permissions)
- [Tests et qualité de code](#tests-et-qualité-de-code)
- [CI/CD](#cicd)
- [Structure du projet](#structure-du-projet)
- [Auteurs](#auteurs)
- [Licence](#licence)

## Stack technique

- **PHP** 8.3+
- **Symfony** 7.4
- **React** 18 (via Symfony UX React)
- **Tailwind CSS** 4
- **Doctrine ORM** 3.6
- **Stripe PHP** 19.4
- **Gotenberg** 8 (Microservice Docker pour la génération de PDF)
- **PostgreSQL** 16 (ou SQLite pour les tests)

## Installation

### Prérequis

- PHP 8.3 ou supérieur
- Composer
- Node.js 20+ et npm
- PostgreSQL (ou SQLite)
- Docker (pour Gotenberg)

### Étapes d'installation

```bash
# 1. Cloner le repository
git clone https://github.com/Kkeryyann/wr602d.git
cd wr602d

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances Node.js et compiler les assets
npm ci
npm run build

# 4. Copier le fichier d'environnement
cp .env .env.local

# 5. Configurer la base de données et Stripe dans .env.local
# DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"
# STRIPE_SECRET_KEY=sk_test_...

# 6. Créer la base de données et exécuter les migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# 7. Charger les fixtures (Plans, Tools)
php bin/console doctrine:fixtures:load

# 8. Lancer le microservice Gotenberg (requis pour la conversion PDF)
docker run --rm -p 3000:3000 gotenberg/gotenberg:8

# 9. Lancer le serveur Symfony
symfony server:start
```

### Installation avec Docker

#### 1. Fichier `compose.yaml` (ou `docker-compose.yml`) inclus

Le projet inclut une configuration Docker pour déployer facilement l'application web, la base de données MariaDB/PostgreSQL, phpMyAdmin, Maildev et Gotenberg.

#### 2. Lancer les conteneurs

```bash
docker-compose up -d
```

Si vous utilisez le conteneur web personnalisé (`mmi3docker/symfony-2024`), vous devrez peut-être initialiser le projet à l'intérieur :

```bash
docker exec -ti symfony-web bash
composer install
npm ci
npm run build
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load
```

#### 3. Accès aux services

| Service | URL / Port |
|---------|-----|
| Application Web | `http://localhost:8319` |
| phpMyAdmin | `http://localhost:8080` |
| Maildev (Emails) | `http://localhost:1080` |
| Gotenberg API | `localhost:3000` |

## Configuration

### Variables d'environnement (`.env.local`)

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://app:!ChangeMe!@127.0.0.1:5432/app?serverVersion=16&charset=utf8"

# Base de données pour les tests (SQLite)
# DATABASE_URL="sqlite:///%kernel.project_dir%/data/database.sqlite"

# Stripe (Paiements et abonnements)
STRIPE_SECRET_KEY=sk_test_...
```

## Fonctionnalités

### Conversion PDF

L'application propose divers outils de conversion de documents via l'API **Gotenberg** :

| Outil | Rôle requis | Description |
|-------|-------------|-------------|
| URL vers PDF | `ROLE_USER` (Gratuit) | Convertit une URL en PDF |
| HTML vers PDF | `ROLE_BASIC` | Convertit un fichier HTML en PDF |
| Word/Excel/PPT vers PDF | `ROLE_BASIC` | Convertit des documents Office |
| Image vers PDF | `ROLE_BASIC` | Convertit des images (jpg, png) en PDF |
| Fusionner des PDFs | `ROLE_PREMIUM` | Combine plusieurs PDF |
| Découper un PDF | `ROLE_PREMIUM` | Extrait des pages d'un PDF |
| Convertir en PDF/A | `ROLE_PREMIUM` | Format d'archivage PDF/A |
| Protéger un PDF | `ROLE_PREMIUM` | Chiffrement avec mot de passe |

### Abonnements et Stripe

Le projet intègre **Stripe Checkout** pour gérer les abonnements mensuels. 
- Les utilisateurs choisissent un plan (FREE, BASIC, PREMIUM).
- Stripe Checkout gère le paiement de manière sécurisée.
- Un **Webhook Stripe** (`/payment/webhook`) met automatiquement à jour le rôle (`ROLE_BASIC`, `ROLE_PREMIUM`) et les limites de l'utilisateur en base de données lorsque le paiement réussit ou que l'abonnement est annulé.

### Génération de PDF (Gotenberg)

Toutes les conversions sont gérées par le service `ApiGotenberg` qui communique avec un conteneur Docker Gotenberg via HTTP (multipart/form-data).

## Rôles et permissions

Le système utilise les Voters de Symfony pour limiter l'accès aux outils et le nombre de générations.

| Rôle | Limites | Accès |
|------|---------|-------|
| `ROLE_USER` (FREE) | 5 conversions / mois | Outils de base (URL) |
| `ROLE_BASIC` | 50 conversions / mois | Outils bureautique (HTML, Office, Images) |
| `ROLE_PREMIUM` | Illimité | Outils avancés (Fusion, PDF/A, Chiffrement) |

## Tests et qualité de code

```bash
# Tests fonctionnels (PHPUnit)
vendor/bin/phpunit

# Vérification du standard PSR-2 (PHP_CodeSniffer)
vendor/bin/phpcs --standard=PSR2 src/

# Analyse statique (PHPStan - niveau 2)
vendor/bin/phpstan analyze src/ --level=2

# Détection de code problématique (PHP Mess Detector)
vendor/bin/phpmd src/ text cleancode,codesize,controversial,design
```

## CI/CD

Le projet utilise **GitHub Actions** pour l'intégration continue (`.github/workflows/workflow.yml`). 
À chaque `push` ou `pull_request` sur les branches `main` ou `develop` :
- Checkout du code et setup de PHP 8.3
- Installation des dépendances Composer
- Setup de Node.js 20, installation des dépendances NPM et build des assets React/Tailwind
- Création d'une base de données SQLite pour les tests (`php bin/console doctrine:schema:update --env=test`)
- Exécution des tests fonctionnels avec **PHPUnit**
- Vérification du code avec **PHP_CodeSniffer**, **PHPStan**, et **PHPMD**.

## Structure du projet

```
├── assets/
│   ├── react/           # Composants React (Header, PricingPage, etc.)
│   ├── styles/          # Fichiers CSS (Tailwind)
│   └── app.js           # Point d'entrée Webpack Encore
├── config/              # Configuration Symfony (Routes, Services, Packages)
├── src/
│   ├── Controller/      # Contrôleurs HTTP (Converter, Account, Webhook Stripe...)
│   ├── DataFixtures/    # Données de test (Plans, Outils)
│   ├── Entity/          # Entités Doctrine (User, Plan, Tool, Generation...)
│   ├── EventListener/   # Écouteurs d'événements (Sauvegarde PDF, Twig Globals)
│   ├── Form/            # Formulaires Symfony
│   ├── Repository/      # Requêtes base de données
│   ├── Security/        # Logique d'authentification et Voters
│   └── Services/        # Logique métier (ApiGotenberg, StripeService)
├── templates/           # Vues Twig
├── tests/               # Tests automatisés (WebTestCase)
├── var/pdf_storage/     # Dossier de stockage local des PDFs générés
└── docker-compose.yml   # Configuration Docker
```

## Auteur

**Job-Faël BABALOLA**

## Licence

Projet sous licence propriétaire.
