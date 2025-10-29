# Integração MongoDB - ContraticManage

Este documento descreve a integração completa do MongoDB no projeto ContraticManage.

## 📋 Visão Geral

O projeto agora utiliza MongoDB como banco de dados principal, com Mongoose como ODM (Object Data Modeling) para melhor estruturação e validação de dados.

## 🏗️ Arquitetura

```
ContraticManage/
├── lib/
│   └── mongodb.js              # Configuração de conexão MongoDB
├── models/
│   ├── Cliente.js              # Schema do Cliente
│   ├── Contrato.js             # Schema do Contrato
│   └── __tests__/              # Testes unitários dos models
│       └── Cliente.test.js
├── pages/api/                  # API Routes usando MongoDB
├── scripts/
│   └── seed.js                 # Script para popular banco
```

## 🚀 Instalação e Configuração

### 1. Instalar MongoDB

#### Linux (Ubuntu/Debian)
```bash
# Importar chave pública
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Adicionar repositório
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Instalar MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar serviço
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows
Baixe o instalador em: https://www.mongodb.com/try/download/community

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado com:

```env
MONGODB_URI=mongodb://localhost:27017/contractic
MONGODB_URI_TEST=mongodb://localhost:27017/contractic-test
```

Para produção, use MongoDB Atlas (gratuito):
```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/contractic?retryWrites=true&w=majority
```

### 3. Popular Banco de Dados

```bash
npm run seed
```

Isso criará:
- 3 clientes de teste
- 5 contratos de exemplo

## 📊 Schemas

### Cliente Schema

```javascript
{
  razaoSocial: String (required, min: 3, max: 200)
  cnpj: String (required, unique, 14 dígitos)
  email: String (required, unique, válido)
  senha: String (required, min: 6, hash com bcrypt)
  telefone: String (optional, 10-11 dígitos)
  endereco: String (optional, max: 300)
  ativo: Boolean (default: true)
  timestamps: createdAt, updatedAt
}
```

**Índices:**
- `cnpj` (unique)
- `email` (unique)
- `ativo`

**Métodos:**
- `compararSenha(senha)` - Compara senha com hash
- `toPublicJSON()` - Retorna dados sem senha

**Hooks:**
- `pre('save')` - Hash de senha automático

### Contrato Schema

```javascript
{
  cliente: ObjectId (required, ref: Cliente)
  titulo: String (required, min: 3, max: 200)
  descricao: String (optional, max: 1000)
  status: String (enum: ativo, inativo, pendente, cancelado)
  conteudo: String (required, HTML)
  dataVigencia: Date (optional)
  variaveis: Map<String, String>
  versao: Number (default: 1)
  historicoVersoes: Array
  timestamps: createdAt, updatedAt
}
```

**Índices:**
- `cliente`
- `cliente + status` (composto)
- `cliente + createdAt` (composto)
- `status + dataVigencia` (composto)

**Métodos:**
- `populateCliente()` - Popula dados do cliente
- `processarTemplate()` - Processa variáveis no template
- `obterVersao(numero)` - Retorna versão específica

**Métodos Estáticos:**
- `buscarPorClientePaginado(clienteId, options)` - Busca com paginação
- `buscarProximosVencimento(dias)` - Contratos próximos ao vencimento

**Hooks:**
- `pre('save')` - Versionamento automático de contratos

## 🔒 Segurança

### Hash de Senhas

Todas as senhas são automaticamente encriptadas com bcrypt antes de serem salvas:

```javascript
// Hook no modelo Cliente
ClienteSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.senha = await bcrypt.hash(this.senha, salt)
  next()
})
```

### Validações

Validações implementadas nos schemas:
- Email válido
- CNPJ com 14 dígitos
- Senha mínima de 6 caracteres
- Telefone entre 10-11 dígitos
- Campos obrigatórios
- Limites de caracteres

## 📡 API Endpoints Atualizados

Todos os endpoints foram atualizados para usar MongoDB:

### Clientes

- `GET /api/clientes` - Lista com paginação
- `GET /api/clientes/:id` - Busca por ID
- `POST /api/clientes` - Criar novo
- `PUT /api/clientes/:id` - Atualizar
- `DELETE /api/clientes/:id` - Deletar (com verificação de contratos)

### Contratos

- `GET /api/contratos` - Lista com paginação e filtros
- `GET /api/contratos?clienteId=xxx` - Filtrar por cliente
- `GET /api/contratos/:id` - Buscar por ID (com populate)
- `POST /api/contratos` - Criar novo
- `PUT /api/contratos/:id` - Atualizar (com versionamento)
- `DELETE /api/contratos/:id` - Deletar
- `DELETE /api/contratos/:id?soft=true` - Soft delete (cancelar)

### Autenticação

- `POST /api/auth/login` - Login com bcrypt

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Apenas testes de models
npm run test:models

# Com UI
npm run test:ui

# Com coverage
npm run test:coverage
```

### Testes Implementados

#### Cliente Model (`models/__tests__/Cliente.test.js`)

- ✅ Validações de campos obrigatórios
- ✅ Validação de email
- ✅ Validação de CNPJ
- ✅ Validação de senha
- ✅ Unicidade de CNPJ e email
- ✅ Hash automático de senha
- ✅ Comparação de senha
- ✅ Método toPublicJSON
- ✅ Campos opcionais

## 📦 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run seed` | Popular banco com dados iniciais |
| `npm run db:reset` | Limpar e repopular banco |
| `npm run test:models` | Executar testes de models |
| `npm run dev:backend` | Iniciar backend com MongoDB |
| `npm run dev:all` | Iniciar frontend + backend |

## 🔄 Versionamento de Contratos

Contratos mantêm histórico automático de versões:

```javascript
// Ao atualizar conteúdo, versão anterior é salva
contrato.conteudo = "Novo conteúdo"
await contrato.save() // Cria versão 2, salva versão 1 no histórico

// Buscar versão específica
const versaoAnterior = contrato.obterVersao(1)
```

## 📈 Performance

### Índices Otimizados

Os schemas possuem índices estratégicos para melhorar performance:

```javascript
// Cliente
ClienteSchema.index({ cnpj: 1 })
ClienteSchema.index({ email: 1 })
ClienteSchema.index({ ativo: 1 })

// Contrato
ContratoSchema.index({ cliente: 1, status: 1 })
ContratoSchema.index({ cliente: 1, createdAt: -1 })
ContratoSchema.index({ status: 1, dataVigencia: 1 })
```

### Paginação

Todas as listagens suportam paginação:

```javascript
GET /api/clientes?page=1&limit=50
GET /api/contratos?page=2&limit=20&status=ativo
```

## 🌐 MongoDB Atlas (Produção)

### Configuração

1. Criar conta em https://www.mongodb.com/cloud/atlas
2. Criar cluster gratuito
3. Adicionar IP do servidor às whitelist
4. Criar usuário do banco
5. Obter connection string
6. Atualizar `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/contractic?retryWrites=true&w=majority
```

### Backup

MongoDB Atlas oferece backups automáticos no plano gratuito.

## 🛠️ Troubleshooting

### Erro: MongooseServerSelectionError

**Problema:** Não consegue conectar ao MongoDB

**Solução:**
```bash
# Verificar se MongoDB está rodando
sudo systemctl status mongod

# Iniciar MongoDB
sudo systemctl start mongod
```

### Erro: Schema hasn't been registered

**Problema:** Model não foi importado corretamente

**Solução:** Verificar imports:
```javascript
import Cliente from '../models/Cliente.js'  // Adicionar .js
```

### Erro: E11000 duplicate key error

**Problema:** Tentando criar documento com chave única duplicada

**Solução:** Campo único (email ou CNPJ) já existe no banco

### Testes Falhando

**Problema:** Testes não conectam ao MongoDB

**Solução:**
```bash
# Verificar se MongoDB de teste está acessível
mongo mongodb://localhost:27017/contractic-test

# Configurar variável de ambiente
export MONGODB_URI_TEST=mongodb://localhost:27017/contractic-test
```

## 📚 Recursos Adicionais

- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/production-notes/)

## 🎯 Próximos Passos

1. ✅ Implementar índices compostos para queries complexas
2. ⏳ Adicionar mais testes de integração
3. ⏳ Implementar agregações para relatórios
4. ⏳ Adicionar soft delete em Cliente
5. ⏳ Implementar auditoria de mudanças
6. ⏳ Adicionar rate limiting nas APIs
7. ⏳ Implementar cache com Redis
8. ⏳ Adicionar full-text search

## 💡 Boas Práticas Implementadas

✅ Validação de dados no schema
✅ Índices para otimização
✅ Hash de senhas com bcrypt
✅ Versionamento de documentos
✅ Soft delete para dados críticos
✅ Populate para relacionamentos
✅ Timestamps automáticos
✅ Tratamento de erros
✅ Testes unitários
✅ Conexão singleton (cache)
✅ Paginação de resultados
✅ Transformações de JSON
