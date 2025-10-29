# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ContraticManage is a contract management system built with a modern full-stack architecture:
- **Frontend**: React + Vite (port 5173) - SPA for client and admin interfaces
- **Backend**: Next.js API Routes (port 3001) - REST API server
- **Database**: MongoDB with Mongoose ODM

The system allows administrators to manage clients and contracts, while clients can log in to view their own contracts.

## Development Commands

### Running the Application

```bash
# Run both frontend and backend simultaneously (recommended)
npm run dev:all

# Run frontend only (Vite dev server on port 5173)
npm run dev

# Run backend only (Next.js API server on port 3001)
npm run dev:backend
```

### Building

```bash
# Build both frontend and backend
npm run build

# Build frontend only (Vite build)
npm run build:frontend

# Build backend only (Next.js build)
npm run build:backend

# Start backend in production mode
npm run start:backend
```

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run only model tests
npm run test:models
```

### Database

```bash
# Seed database with initial data (3 clients + 5 contracts)
npm run seed

# Reset database (clear and reseed)
npm run db:reset
```

### Linting

```bash
npm run lint
```

## Architecture

### Frontend Structure

```
src/
├── components/          # React components
│   ├── LoginPage.jsx           # Admin login
│   ├── LoginCliente.jsx        # Client login
│   ├── Dashboard.jsx           # Admin dashboard
│   ├── ClienteDashboard.jsx    # Client dashboard
│   ├── CadastrarCliente.jsx    # Client registration form
│   ├── CadastrarContrato.jsx   # Contract creation form
│   ├── EditarContrato.jsx      # Contract editing
│   ├── ClientesContratos.jsx   # Admin view of clients/contracts
│   └── ProtectedRoute.jsx      # Route protection HOC
├── context/             # React Context providers
│   └── AuthContext.js          # Authentication state management
├── services/            # API client services
│   ├── clienteService.js       # Client CRUD operations
│   └── contratoService.js      # Contract CRUD operations
└── utils/               # Utility functions
    ├── maskUtils.js            # Input masking (CNPJ, phone)
    └── templateProcessor.js    # Contract template variable processing
```

### Backend Structure

```
pages/api/               # Next.js API Routes
├── auth/
│   └── login.js                # POST /api/auth/login
├── clientes/
│   ├── index.js                # GET/POST /api/clientes
│   └── [id].js                 # GET/PUT/DELETE /api/clientes/:id
└── contratos/
    ├── index.js                # GET/POST /api/contratos
    └── [id].js                 # GET/PUT/DELETE /api/contratos/:id

lib/
└── mongodb.js           # MongoDB connection with singleton pattern

models/
├── Cliente.js           # Cliente Mongoose schema
└── Contrato.js          # Contrato Mongoose schema
```

### Data Models

#### Cliente (Client)
- **Fields**: razaoSocial, cnpj (unique), email (unique), senha (bcrypt hashed), telefone, endereco, ativo
- **Indexes**: cnpj, email, ativo
- **Methods**: `compararSenha()`, `toPublicJSON()`
- **Hooks**: Pre-save automatic password hashing

#### Contrato (Contract)
- **Fields**: cliente (ref), titulo, descricao, status (enum), conteudo (HTML), dataVigencia, variaveis (Map), versao, historicoVersoes
- **Indexes**: cliente, (cliente + status), (cliente + createdAt), (status + dataVigencia)
- **Methods**: `populateCliente()`, `processarTemplate()`, `obterVersao()`
- **Static Methods**: `buscarPorClientePaginado()`, `buscarProximosVencimento()`
- **Hooks**: Pre-save automatic versioning when content changes

### API Communication

The frontend services communicate with the Next.js backend using the `VITE_API_URL` environment variable (defaults to `http://localhost:3001/api`). All API calls use standard fetch with JSON.

CORS is configured in `next.config.js` to allow requests from the Vite dev server.

## Environment Configuration

Required environment variables (see `.env.example`):

```env
# Backend API URL for frontend
VITE_API_URL=http://localhost:3001/api

# Frontend URL for CORS configuration
FRONTEND_URL=http://localhost:5173

# MongoDB connection strings
MONGODB_URI=mongodb://localhost:27017/contractic
MONGODB_URI_TEST=mongodb://localhost:27017/contractic-test
```

## Key Features & Patterns

### Authentication
- Password hashing with bcrypt (10 salt rounds)
- Passwords automatically hashed in Cliente model pre-save hook
- Passwords excluded from queries by default (`select: false`)
- Client login via `/api/auth/login` endpoint

### Contract Template System
- Contracts support variable interpolation in HTML content
- Variables stored as Map in `variaveis` field
- Template processing via `processarTemplate()` method
- Example: `{{razaoSocial}}`, `{{cnpj}}`, `{{data_atual}}`

### Automatic Versioning
- Contracts maintain full version history in `historicoVersoes` array
- Version increments automatically when `conteudo` is modified
- Previous versions stored with timestamp
- Retrieve specific versions via `obterVersao(numero)` method

### Database Patterns
- Singleton connection pattern in `lib/mongodb.js` prevents connection leaks during hot reload
- Model export pattern prevents recompilation: `mongoose.models.Cliente || mongoose.model('Cliente', ClienteSchema)`
- Pagination support in list endpoints
- Compound indexes for optimized queries

### Soft Delete
- Contracts can be soft deleted by setting `status: 'cancelado'`
- Use query parameter: `DELETE /api/contratos/:id?soft=true`

## Testing

Tests use Vitest with jsdom environment for React component testing. Model tests connect to a separate test database (`MONGODB_URI_TEST`).

Test setup in `src/tests/setup.js` configures the testing environment.

## Production Considerations

1. **MongoDB**: Backend is configured to work with Railway's MongoDB or MongoDB Atlas. Connection automatically uses `DATABASE_URL`, `MONGO_URL`, or `MONGODB_URI` environment variables
2. **Railway Deployment**: See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for complete deployment guide
3. **CORS**: Update `FRONTEND_URL` in `.env` and `next.config.js` with production frontend URL
4. **Authentication**: Current system is basic. Consider implementing JWT tokens and refresh tokens
5. **Rate Limiting**: Not implemented. Should be added to API routes
6. **Input Validation**: Add server-side validation library (Zod, Joi) for API endpoints
7. **Logging**: Add structured logging for monitoring and debugging

### Railway Configuration

The project includes Railway-ready configuration files:
- **`railway.json`** - Build and deploy settings
- **`nixpacks.toml`** - Environment and package configuration
- **`lib/mongodb.js`** - Automatic Railway environment variable detection

## Default Test Credentials

After running `npm run seed`, use these credentials to login:

1. **Tech Solutions Ltda**: contato@techsolutions.com / tech123
2. **Comercial Silva & Cia**: contato@comercialsilva.com / silva123
3. **Empresa Demo Teste**: demo@empresa.com / demo123
