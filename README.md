
# 👥 README – `fitconnect-community-service`

# FitConnect – Community Service

Service responsable de la gestion des communautés (groupes) et des membres.

---

## Responsabilités

- Création et gestion des groupes
- Gestion des membres d’un groupe
- Rôles (admin / membre)
- Lien entre `userId` (Auth Service) et `groupId`

---

## Stack

- NestJS
- PostgreSQL (schéma `community`)
- Redis (cache des groupes et membres)
- gRPC (communication interne)
- GraphQL (sous-schéma fédéré)

---

## Modèle PostgreSQL (schéma `community`)

```sql
CREATE SCHEMA IF NOT EXISTS community;

CREATE TABLE community.group (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE community.membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  group_id UUID NOT NULL REFERENCES community.group(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, group_id)
);
