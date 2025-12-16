# First API

Uma API RESTful construída com Express.js e Prisma, demonstrando um padrão de arquitetura em camadas para autenticação e gerenciamento de usuários.

## 📋 Índice

- [Visão Geral do Projeto](#visão-geral-do-projeto)
- [Arquitetura](#arquitetura)
- [Começando](#começando)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Executando a API](#executando-a-api)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## Visão Geral do Projeto

Esta API implementa um endpoint de **Sign-Up** com uma arquitetura em camadas limpa e bem definida. A aplicação utiliza:

- **Express.js** - Framework web
- **Prisma** - ORM para gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de dados
- **Docker Compose** - Orquestração de containers

---

## Arquitetura

A API segue um padrão de **arquitetura em camadas**, garantindo separação de responsabilidades e manutenibilidade:

```mermaid
graph TB
    Client["🌐 Cliente HTTP<br/>(Postman, Browser, etc)"]

    subgraph "Camada de Rotas"
        Routes["📍 Rotas<br/>main-route.ts"]
    end

    subgraph "Camada de Controlador"
        Controller["🎮 Controlador<br/>sign-up-controller.ts<br/>- Parseamento de requisição<br/>- Validação com Zod<br/>- Tratamento de erros"]
    end

    subgraph "Camada de Lógica de Negócio"
        UseCase["⚙️ Caso de Uso<br/>sign-up-usecase.ts<br/>- Validação de usuário<br/>- Hash de senha<br/>- Regras de negócio"]
    end

    subgraph "Camada de Dados"
        Prisma["💾 Cliente Prisma<br/>prisma.ts<br/>- Consultas ao banco<br/>- Operações ORM"]
    end

    Database["🗄️ PostgreSQL<br/>Banco de Dados"]

    Client -->|HTTP POST| Routes
    Routes -->|Manipulador de rota| Controller
    Controller -->|Chamada com dados validados| UseCase
    UseCase -->|Query/Create| Prisma
    Prisma -->|SQL| Database
    Database -->|Resposta| Prisma
    Prisma -->|Dados do usuário| UseCase
    UseCase -->|Resultado| Controller
    Controller -->|Resposta JSON| Client
```

### Detalhamento das Camadas

#### 🌐 **Camada de Rotas** (`src/routes/main-route.ts`)
- Define os endpoints da API e métodos HTTP
- Mapeia requisições recebidas para controladores
- Gerencia o roteamento de requisições

#### 🎮 **Camada de Controlador** (`src/controllers/sign-up-controller.ts`)
- Trata requisição/resposta HTTP
- Valida payloads de requisição usando schemas Zod
- Gerencia respostas de erro
- Passa dados validados para casos de uso

#### ⚙️ **Camada de Lógica de Negócio** (`src/use-cases/sign-up-usecase.ts`)
- Contém a lógica central do negócio
- Verifica se o usuário já existe
- Realiza hash de senhas com bcrypt
- Orquestra operações de dados
- Retorna respostas estruturadas

#### 💾 **Camada de Dados** (`src/lib/prisma/prisma.ts`)
- Trata todas as operações do banco de dados
- Gerencia a instância do cliente Prisma
- Executa consultas através do ORM Prisma

---

## Começando

### Pré-requisitos

Certifique-se de ter o seguinte instalado:

- **Node.js** (v18+)
- **npm** ou **yarn**
- **Docker** e **Docker Compose**
- **PostgreSQL** (ou use Docker Compose)

### Instalação

1. **Clone ou navegue até o diretório do projeto:**

```bash
cd /Users/Henrique/Documents/www/yt/firstApi
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` no diretório raiz:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/firstapi"
```

4. **Execute as migrações do Prisma:**

```bash
npx prisma migrate dev
```

Isso irá:
- Criar o schema do banco de dados
- Aplicar todas as migrações
- Gerar o Cliente Prisma

### Executando a API

#### Opção 1: Usando Docker Compose (Recomendado)

```bash
docker-compose up -d
```

Isso inicia o banco de dados PostgreSQL em background.

#### Opção 2: Modo de Desenvolvimento com hot-reload

```bash
npm run dev
```

O servidor iniciará e observará mudanças de arquivo. Você verá:

```
Server running in dev mode.
```

A API estará disponível em: **`http://localhost:3333`**

---

## Endpoints da API

### POST `/sign-up`

Cria uma nova conta de usuário.

**Requisição:**

```http
POST /sign-up HTTP/1.1
Host: localhost:3333
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "minhasenha123"
}
```

**Schema do Corpo da Requisição:**

| Campo | Tipo | Validação |
|-------|------|-----------|
| `email` | string | Deve ser um email válido |
| `password` | string | Mínimo 3 caracteres |

**Resposta de Sucesso (201 Created):**

```json
Status: 201 Created
{
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "password": "hashPasswordSenha",
    "createdAt": "2025-12-15T10:30:00Z"
  }
}
```

**Respostas de Erro:**

**409 - Usuário Já Existe:**
```json
{
  "message": "User already exist"
}
```

---

### POST `/sign-in`

Autentica um usuário e retorna um JWT token.

**Requisição:**

```http
POST /sign-in HTTP/1.1
Host: localhost:3333
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "minhasenha123"
}
```

**Schema do Corpo da Requisição:**

| Campo | Tipo | Validação |
|-------|------|-----------|
| `email` | string | Deve ser um email válido |
| `password` | string | Mínimo 3 caracteres |

**Resposta de Sucesso (200 OK):**

```json
{
  "user": {
    "email": "usuario@exemplo.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Respostas de Erro:**

**409 - Usuário Não Existe:**
```json
{
  "message": "User already exist"
}
```

**401 - Senha Incorreta:**
```json
{
  "message": "Unauthorized."
}
```

---

### GET `/profile`

Obtém os dados do perfil do usuário autenticado.

**Requisição:**

```http
GET /profile HTTP/1.1
Host: localhost:3333
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Headers Obrigatórios:**

| Header | Tipo | Descrição |
|--------|------|-----------|
| `Authorization` | string | Bearer token JWT obtido no sign-in |

**Resposta de Sucesso (200 OK):**

```json
{
  "id": "uuid",
  "email": "usuario@exemplo.com",
  "createdAt": "2025-12-15T10:30:00Z"
}
```

**Respostas de Erro:**

**401 - Token Inválido ou Ausente:**
```json
{
  "message": "Unauthorized."
}
```

**404 - Usuário Não Encontrado:**
```json
{
  "message": "User already exist"
}
```

---

## Estrutura do Projeto

```
firstApi/
├── src/
│   ├── index.ts                      # Ponto de entrada
│   ├── @types/
│   │   └── express.d.ts              # Extensão de tipos do Express
│   ├── app/
│   │   ├── errors/
│   │   │   ├── unauthorized-error.ts       # Erro 401 - Não autorizado
│   │   │   └── user-already-exist-error.ts # Erro 409 - Usuário já existe
│   │   └── use-cases/
│   │       ├── profile-usecase.ts    # Lógica de busca de perfil
│   │       ├── sign-in-usecase.ts    # Lógica de autenticação
│   │       └── sign-up-usecase.ts    # Lógica de registro
│   ├── controllers/
│   │   ├── profile-controller.ts     # Tratamento de perfil
│   │   ├── sign-in-controller.ts     # Tratamento de login
│   │   └── sign-up-controller.ts     # Tratamento de registro
│   ├── infra/
│   │   ├── controllers/
│   │   │   └── sign-up-controller.ts
│   │   ├── middlewares/
│   │   │   ├── error-handler.ts      # Middleware de tratamento de erros
│   │   │   └── isAuth.ts             # Middleware de autenticação JWT
│   │   └── routes/
│   │       └── main-route.ts         # Definições de rotas
│   └── lib/
│       └── prisma/
**Sign-Up:**
```bash
curl -X POST http://localhost:3333/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senhasegura123"
  }'
```

**Sign-In:**
```bash
curl -X POST http://localhost:3333/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senhasegura123"
  }'
```

**Profile (com token):**
```bash
curl -X GET http://localhost:3333/profile \
  -H "Authorization: Bearer seu_token_jwt_aqui"
```

### Usando Postman

#### 1. Sign-Up

1. Crie uma nova requisição **POST**
2. URL: `http://localhost:3333/sign-up`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

#### 2. Sign-In

1. Crie uma nova requisição **POST**
2. URL: `http://localhost:3333/sign-in`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```
5. **Copie o token** da resposta

#### 3. Profile

1. Crie uma nova requisição **GET**
2. URL: `http://localhost:3333/profile`
3. Headers:
   - `Authorization: Bearer <seu_token_aqui>`
4. Body: (vazio)

### Usando Arquivo HTTP (`request.http`)

O projeto inclui um arquivo `request.http` para testes com a extensão REST Client do VS Code:

```http
### Sign-Up
POST http://localhost:3333/sign-up
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "password": "senha123"
}

### Sign-In
POST http://localhost:3333/sign-in
Content-Type: application/json

{
  "email": "teste@exemplo.com",
  "password": "senha123"
}

### Get Profile (com token)
GET http://localhost:3333/profile
Authorization: Bearer seu_token_aqui
```
- **Validação de Dados**: Schemas Zod para validação de entrada

### 🗄️ Banco de Dados

- **PostgreSQL**: Banco de dados relacional robusto
- **Prisma ORM**: Interface type-safe para operações de banco de dados
- **Migrações**: Controle de versão do schema do banco de dados

### 🎯 Gerenciamento de Erros

A API possui tratamento robusto de erros com classes personalizadas:

#### **UnauthorizedError**
- HTTP Status: **401 Unauthorized**
- Lançado quando: Credenciais inválidas ou token JWT ausente/inválido
- Mensagem: `"Unauthorized."`

#### **UserAlreadyExistError**
- HTTP Status: **409 Conflict** (para sign-up) ou **404 Not Found** (para profile)
- Lançado quando: Email já registrado ou usuário não encontrado
- Mensagem: `"User already exist"`

---

## Testando a API

### Usando cURL

```bash
curl -X POST http://localhost:3333/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "senhasegura123"
  }'
```

### Usando Postman

1. Crie uma nova requisição POST
2. URL: `http://localhost:3333/sign-up`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

### Usando Arquivo HTTP (`request.http`)

O projeto inclui um arquivo `request.http` para testes com a extensão REST Client do VS Code.

---

## Desenvolvimento

### Execute TypeScript em modo watch:

```bash
npm run dev
```

### Gere o Cliente Prisma após alterações no schema:

```bash
npx prisma generate
```

---

## Dependências

- **express** - Framework web
- **@prisma/client** - ORM
- **pg** - Driver PostgreSQL
- **bcrypt** - Hash de senhas
- **zod** - Validação de schema
- **dotenv** - Variáveis de ambiente
- **tsx** - Executor TypeScript
- **jsonwebtoken** - Autenticação para gerar token

---

## Licença

ISC
