
---

### 1. Prérequis

* Node.js (v18+)
* npm (v9+), Yarn ou pnpm
* Docker & Docker Compose
* Accès au dépôt Git (clone si besoin)

```bash
# Si tu n'as pas encore le code :
git clone <URL_DU_REPO>
cd <NOM_DU_PROJET>
```

---

### 2. Variables d'environnement

1. Copie le modèle :

   ```bash
   cp .env.example .env.local
   ```
2. Dans `.env.local`, vérifie ou ajuste :

   ```dotenv
   DATABASE_URL="mongodb://mongo:27017/engine_data"
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

---

### 3. Installation des dépendances

* Hors Docker (rapide pour installer localement) :

  ```bash
  npm install
  # ou yarn, pnpm install
  ```

* Avec Docker (dans le conteneur builder) :

  ```bash
  npm run dc:up    # monte app + mongo
  ```

---

### 4. Base de données & Prisma

1. Génère le client Prisma :

   ```bash
   npm run prisma:gen
   ```
2. Applique le schéma :

   ```bash
   npm run prisma:push
   ```
3. (Optionnel) Lance Studio :

   ```bash
   npm run prisma:studio
   # ouvre http://localhost:5555
   ```

---

### 5. Import / Seed des données

* **Import CSV** :

  ```bash
  npm run db:import
  ```
* **Seed via script** : (si tu as `scripts/seed-from-csv.mjs`)

  ```bash
  npm run seed-csv
  ```

Après import, vérifie avec Mongo CLI ou Studio.

---

### 6. Développement local

* **Mode dev (local)** :

  ```bash
  npm run dev
  # si port 3000 occupé, passe en 3001 automatiquement
  ```

  Le code source (`app/` ou `pages/`) est surveillé, hot-reload actif.

* **Mode dev (Docker)** : si tu veux que le conteneur gère tout :

  ```bash
  npm run dc:dev
  # utilise le service Docker dédié "dev"
  ```

Visiter **[http://localhost:3000](http://localhost:3000)** (ou 3001) dans ton navigateur.

---

### 7. Build et production

1. Construis le projet :

   ```bash
   npm run build
   ```
2. Démarre en mode prod (Docker ou local) :

   ```bash
   npm start
   ```

---

### 8. Tests & Lint

* **Tests unitaires** : `npm test`
* **Lint** : `npm run lint`
* **Prettier** : `npm run prettier`

---

### 9. Commandes utiles résumé

| Alias                   | Description                                 |
| ----------------------- | ------------------------------------------- |
| `npm run dc:up`         | Build & lance Docker Compose (prod & mongo) |
| `npm run dc:down`       | Arrête tout                                 |
| `npm run dc:dev`        | Lance le mode dev dans Docker               |
| `npm run dev`           | Mode dev local                              |
| `npm run build`         | Build prod                                  |
| `npm start`             | Lancer l'app en prod                        |
| `npm run prisma:gen`    | Génère Prisma client                        |
| `npm run prisma:push`   | Push du schéma Prisma                       |
| `npm run prisma:studio` | Ouvre Prisma Studio                         |
| `npm run db:import`     | Import CSV vers Mongo                       |
| `npm test`              | Lance les tests Jest                        |
| `npm run lint`          | Vérifie la qualité du code ESLint           |
| `npm run prettier`      | Formate le code                             |

---

### 10. Structure du projet

```
mon-projet-nextjs/
├─ app/ or pages/      # Tes routes et composants Next.js
├─ public/             # Fichiers statiques
├─ prisma/             # schema.prisma, migrations
├─ scripts/            # import, export, seed
├─ Dockerfile
├─ docker-compose.yml
├─ .env.local
├─ package.json        # scripts & dépendances
└─ README.md           # Ce fichier
```

---