# Backend Next.js - ContraticManage

Este documento descreve a integração do Next.js como backend para o projeto ContraticManage.

## 📋 Visão Geral

O projeto agora utiliza Next.js como backend API, oferecendo uma solução completa de full-stack:
- **Frontend**: Vite + React (porta 5173)
- **Backend**: Next.js API Routes (porta 3001)

## 🏗️ Estrutura do Projeto

```
ContraticManage/
├── pages/                      # Backend Next.js
│   └── api/                   # API Routes
│       ├── db.js              # Banco de dados em memória
│       ├── clientes/          # Endpoints de clientes
│       │   ├── index.js       # GET /api/clientes, POST /api/clientes
│       │   └── [id].js        # GET/PUT/DELETE /api/clientes/:id
│       ├── contratos/         # Endpoints de contratos
│       │   ├── index.js       # GET /api/contratos, POST /api/contratos
│       │   └── [id].js        # GET/PUT/DELETE /api/contratos/:id
│       └── auth/              # Endpoints de autenticação
│           └── login.js       # POST /api/auth/login
├── src/                       # Frontend Vite + React
│   ├── services/              # Serviços que consomem a API
│   │   ├── clienteService.js
│   │   └── contratoService.js
│   └── ...
├── next.config.js             # Configuração do Next.js
└── .env.example               # Variáveis de ambiente exemplo
```

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

### 3. Executar o Projeto

#### Opção 1: Executar Frontend e Backend Simultaneamente

```bash
npm run dev:all
```

Isso iniciará:
- Backend (Next.js) na porta 3001
- Frontend (Vite) na porta 5173

#### Opção 2: Executar Separadamente

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev
```

## 📡 API Endpoints

### Clientes

#### Listar todos os clientes
```http
GET http://localhost:3001/api/clientes
```

#### Buscar cliente por ID
```http
GET http://localhost:3001/api/clientes/:id
```

#### Criar novo cliente
```http
POST http://localhost:3001/api/clientes
Content-Type: application/json

{
  "razaoSocial": "Empresa Exemplo Ltda",
  "cnpj": "12.345.678/0001-90",
  "email": "contato@exemplo.com",
  "senha": "senha123",
  "telefone": "(67) 99999-9999",
  "endereco": "Rua Exemplo, 123"
}
```

#### Atualizar cliente
```http
PUT http://localhost:3001/api/clientes/:id
Content-Type: application/json

{
  "razaoSocial": "Empresa Atualizada Ltda",
  "telefone": "(67) 88888-8888"
}
```

#### Deletar cliente
```http
DELETE http://localhost:3001/api/clientes/:id
```

### Contratos

#### Listar todos os contratos
```http
GET http://localhost:3001/api/contratos
```

#### Listar contratos de um cliente específico
```http
GET http://localhost:3001/api/contratos?clienteId=123
```

#### Buscar contrato por ID
```http
GET http://localhost:3001/api/contratos/:id
```

#### Criar novo contrato
```http
POST http://localhost:3001/api/contratos
Content-Type: application/json

{
  "clienteId": "123",
  "titulo": "Contrato de Serviços",
  "descricao": "Descrição do contrato",
  "status": "ativo",
  "conteudo": "<h2>Contrato</h2><p>Conteúdo...</p>",
  "dataVigencia": "2025-12-31T00:00:00.000Z",
  "variaveis": {
    "razaoSocial": "Empresa Exemplo",
    "cnpj": "12.345.678/0001-90"
  }
}
```

#### Atualizar contrato
```http
PUT http://localhost:3001/api/contratos/:id
Content-Type: application/json

{
  "titulo": "Contrato Atualizado",
  "status": "inativo"
}
```

#### Deletar contrato
```http
DELETE http://localhost:3001/api/contratos/:id
```

### Autenticação

#### Login de cliente
```http
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "contato@techsolutions.com",
  "senha": "tech123"
}
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "cliente": {
    "id": "mock-cliente-1",
    "razaoSocial": "Tech Solutions Ltda",
    "cnpj": "12.345.678/0001-90",
    "email": "contato@techsolutions.com",
    "telefone": "(67) 99999-1111",
    "endereco": "Rua das Flores, 123 - Campo Grande/MS",
    "dataCadastro": "2024-01-15T00:00:00.000Z"
  }
}
```

## 🔧 Configuração

### CORS

O Next.js está configurado para permitir requisições do frontend Vite através de headers CORS no arquivo `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'http://localhost:5173' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
        // ...
      ],
    },
  ]
}
```

### Banco de Dados

Atualmente, o backend utiliza um **banco de dados em memória** (arquivo `pages/api/db.js`) com dados mock para desenvolvimento.

Para migrar para um banco de dados real em produção:

1. Instale o driver do banco desejado (PostgreSQL, MongoDB, etc.)
2. Configure a conexão no arquivo `pages/api/db.js`
3. Substitua as funções CRUD para usar o banco real

Exemplo com PostgreSQL:
```bash
npm install pg
```

## 📦 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia apenas o frontend (Vite) |
| `npm run dev:backend` | Inicia apenas o backend (Next.js na porta 3001) |
| `npm run dev:all` | Inicia frontend e backend simultaneamente |
| `npm run build` | Build completo (frontend + backend) |
| `npm run build:frontend` | Build apenas do frontend |
| `npm run build:backend` | Build apenas do backend |
| `npm run start:backend` | Inicia o backend em modo produção |

## 🔐 Credenciais de Teste

Clientes mock disponíveis para login:

1. **Tech Solutions Ltda**
   - Email: `contato@techsolutions.com`
   - Senha: `tech123`

2. **Comercial Silva & Cia**
   - Email: `contato@comercialsilva.com`
   - Senha: `silva123`

3. **Empresa Demo Teste**
   - Email: `demo@empresa.com`
   - Senha: `demo123`

## 🚀 Deploy

### Backend (Next.js)

O backend pode ser deployado em:
- **Vercel** (recomendado para Next.js)
- **AWS**
- **Heroku**
- **DigitalOcean**
- Qualquer plataforma que suporte Node.js

### Frontend (Vite)

O frontend pode ser deployado em:
- **Vercel**
- **Netlify**
- **GitHub Pages**
- Qualquer serviço de hospedagem estática

**Importante**: Após deploy, atualize as variáveis de ambiente com as URLs de produção.

## 🔄 Próximos Passos

1. **Implementar banco de dados real** (PostgreSQL, MongoDB, etc.)
2. **Adicionar autenticação JWT** para segurança
3. **Implementar validação de dados** com bibliotecas como Zod ou Joi
4. **Adicionar testes de integração** para as API routes
5. **Implementar rate limiting** para prevenir abuso da API
6. **Adicionar logging** para monitoramento
7. **Configurar CI/CD** para deploy automático

## 📚 Documentação Adicional

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vite Build](https://vitejs.dev/guide/build.html)

## 💡 Dicas

- Use ferramentas como **Postman** ou **Insomnia** para testar os endpoints da API
- Configure o **ESLint** para manter a qualidade do código
- Use **TypeScript** para melhor type safety (opcional)
- Implemente **testes automatizados** para garantir qualidade

## 🐛 Troubleshooting

### Erro de CORS
Se encontrar erros de CORS, verifique:
1. Se o backend está rodando na porta 3001
2. Se a URL do frontend está correta no `next.config.js`
3. Se o arquivo `.env` está configurado corretamente

### Porta já em uso
Se a porta 3001 estiver em uso:
```bash
# Linux/Mac
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Dados não persistem
Lembre-se que os dados estão em memória e serão perdidos ao reiniciar o servidor. Para persistência, implemente um banco de dados real.
