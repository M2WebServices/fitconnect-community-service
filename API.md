# FitConnect Community Service 👥

Service responsable de la gestion des communautés (groupes) et des membres pour la plateforme FitConnect.

## 📋 Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Modules](#modules)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Running](#running)
- [Testing](#testing)

---

## 🚀 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd fitconnect-community-service
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Run database migrations**
```bash
npm run migration:run
```

---

## ⚙️ Configuration

### Environment Variables

Créez un fichier `.env` à la racine avec les variables suivantes :

```env
# Environment
NODE_ENV=development
PORT=3001

# Database PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=fitconnect_community

# CORS
CORS_ORIGIN=http://localhost:3000

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 🏗️ Architecture

```
fitconnect-community-service/
├── src/
│   ├── common/
│   │   └── enums/
│   │       └── role.enum.ts
│   ├── modules/
│   │   ├── user/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── entities/
│   │   │   ├── interfaces/
│   │   │   ├── dtos/
│   │   │   └── user.module.ts
│   │   ├── group/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── entities/
│   │   │   ├── interfaces/
│   │   │   ├── dtos/
│   │   │   └── group.module.ts
│   │   └── membership/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── entities/
│   │       ├── interfaces/
│   │       ├── dtos/
│   │       └── membership.module.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── migrations/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 📦 Modules

### 1️⃣ USER MODULE

Responsable de la gestion des utilisateurs.

**Fichiers Clés:**
- `user.entity.ts` - Entité TypeORM
- `user.repository.ts` - Accès base de données
- `user.service.ts` - Logique métier
- `user.controller.ts` - Endpoints REST

**Responsabilités:**
- ✅ Créer utilisateur
- ✅ Récupérer utilisateur par ID, email, username
- ✅ Vérifier l'unicité de l'email
- ✅ Lister tous les utilisateurs

**Model:**
```typescript
interface User {
  id: string (UUID)
  username: string (unique)
  email: string (unique)
  createdAt: Date
}
```

---

### 2️⃣ GROUP MODULE

Responsable de la gestion des groupes/communautés.

**Fichiers Clés:**
- `group.entity.ts` - Entité TypeORM
- `group.repository.ts` - Accès base de données
- `group.service.ts` - Logique métier
- `group.controller.ts` - Endpoints REST

**Responsabilités:**
- ✅ Créer groupe
- ✅ Récupérer groupe par ID ou nom
- ✅ Lister groupes d'un utilisateur
- ✅ Lister tous les groupes

**Model:**
```typescript
interface Group {
  id: string (UUID)
  name: string
  description: string (optional)
  createdAt: Date
}
```

---

### 3️⃣ MEMBERSHIP MODULE (CORE RELATIONNEL) ⭐

**Le cœur du système** - Gère les relations entre utilisateurs et groupes.

**Fichiers Clés:**
- `membership.entity.ts` - Entité TypeORM
- `membership.repository.ts` - Accès base de données
- `membership.service.ts` - Logique métier
- `membership.controller.ts` - Endpoints REST

**Responsabilités:**
- ✅ Ajouter membre à un groupe
- ✅ Retirer membre d'un groupe
- ✅ Vérifier appartenance utilisateur à un groupe
- ✅ Récupérer tous les membres d'un groupe
- ✅ Vérifier rôle (admin/member)
- ✅ Récupérer admins d'un groupe
- ✅ Compter membres d'un groupe
- ✅ Compter groupes d'un utilisateur

**Model:**
```typescript
interface Membership {
  id: string (UUID)
  userId: string (UUID)
  groupId: string (UUID)
  role: 'ADMIN' | 'MEMBER'
  joinedAt: Date
}

// Constraints:
// - UNIQUE(userId, groupId)
// - Foreign Key: userId -> user.id (ON DELETE CASCADE)
// - Foreign Key: groupId -> group.id (ON DELETE CASCADE)
```

---

### 4️⃣ ROLE ENUM

Simple énumération des rôles disponibles.

```typescript
export enum Role {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}
```

---

## 🔌 API Endpoints

### USER Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Créer un utilisateur |
| GET | `/users/:id` | Récupérer utilisateur par ID |
| GET | `/users/email/:email` | Récupérer utilisateur par email |
| GET | `/users/username/:username` | Récupérer utilisateur par username |
| GET | `/users` | Lister tous les utilisateurs |

**Exemple Request:**
```bash
# Create User
POST /users
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

### GROUP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/groups` | Créer un groupe |
| GET | `/groups/:id` | Récupérer groupe par ID |
| GET | `/groups/name/:name` | Récupérer groupe par nom |
| GET | `/groups/user/:userId` | Lister groupes d'un utilisateur |
| GET | `/groups` | Lister tous les groupes |

**Exemple Request:**
```bash
# Create Group
POST /groups
Content-Type: application/json

{
  "name": "Fitness Club",
  "description": "Pour les amateurs de fitness"
}
```

---

### MEMBERSHIP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/memberships/add-member` | Ajouter membre à groupe |
| DELETE | `/memberships/remove-member` | Retirer membre d'un groupe |
| GET | `/memberships/check` | Vérifier appartenance (query: userId, groupId) |
| GET | `/memberships/check-admin` | Vérifier rôle admin (query: userId, groupId) |
| GET | `/memberships/group/:groupId/members` | Récupérer membres du groupe |
| GET | `/memberships/group/:groupId/admins` | Récupérer admins du groupe |
| GET | `/memberships/group/:groupId/count` | Compter membres du groupe |
| GET | `/memberships/user/:userId/groups` | Récupérer groupes de l'utilisateur |
| GET | `/memberships/user/:userId/count` | Compter groupes de l'utilisateur |
| PATCH | `/memberships/:id/role` | Mettre à jour rôle d'un membre |

**Exemples Requests:**
```bash
# Add Member to Group
POST /memberships/add-member
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "groupId": "550e8400-e29b-41d4-a716-446655440001",
  "role": "MEMBER"
}

# Remove Member from Group
DELETE /memberships/remove-member
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "groupId": "550e8400-e29b-41d4-a716-446655440001"
}

# Check if user is in group
GET /memberships/check?userId=550e8400-e29b-41d4-a716-446655440000&groupId=550e8400-e29b-41d4-a716-446655440001

# Check if user is admin
GET /memberships/check-admin?userId=550e8400-e29b-41d4-a716-446655440000&groupId=550e8400-e29b-41d4-a716-446655440001

# Get group members
GET /memberships/group/550e8400-e29b-41d4-a716-446655440001/members

# Update member role
PATCH /memberships/550e8400-e29b-41d4-a716-446655440002/role
Content-Type: application/json

{
  "role": "ADMIN"
}
```

---

## 🗄️ Database Schema

### PostgreSQL Schema: `community`

```sql
-- User Table
CREATE TABLE community.user (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  constraint_created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Group Table
CREATE TABLE community.group (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Membership Table (Many-to-Many)
CREATE TABLE community.membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES community.user(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES community.group(id) ON DELETE CASCADE,
  role VARCHAR NOT NULL DEFAULT 'MEMBER',
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, group_id)
);

-- Indexes
CREATE INDEX idx_membership_user_id ON community.membership(user_id);
CREATE INDEX idx_membership_group_id ON community.membership(group_id);
```

---

## ▶️ Running

### Development Mode
```bash
npm run start:dev
```
Service runs sur http://localhost:3001

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

---

## 🧪 Testing

### Run Unit Tests
```bash
npm run test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:cov
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 🛠️ Available Scripts

```bash
npm run build          # Compile TypeScript
npm run start          # Start production server
npm run start:dev      # Start with watch mode
npm run start:debug    # Start with debugger
npm run lint           # Run ESLint with auto-fix
npm run format         # Format code with Prettier
npm run test           # Run Jest unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Generate coverage report
npm run migration:generate  # Generate new migration
npm run migration:run       # Run migrations
migration:revert       # Revert last migration
```

---

## 📄 License

UNLICENSED

## 👨‍💼 Author

M2 WebServices Team
