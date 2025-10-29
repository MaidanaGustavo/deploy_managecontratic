# 🚂 Guia de Deploy no Railway

Este guia explica como fazer o deploy do **ContraticManage Backend** na plataforma Railway.

## 📋 Pré-requisitos

1. Conta no [Railway](https://railway.app/)
2. Repositório Git (GitHub, GitLab, ou Bitbucket)
3. Código commitado e pushado para o repositório

## 🚀 Passo a Passo para Deploy

### 1. Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app/) e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha o repositório **ContraticManage**
5. O Railway irá detectar automaticamente que é um projeto Next.js

### 2. Configurar MongoDB

Você tem duas opções para o banco de dados:

#### Opção A: MongoDB no Railway (Recomendado para testes)

1. No seu projeto Railway, clique em **"+ New"**
2. Selecione **"Database" → "Add MongoDB"**
3. O Railway irá criar automaticamente a variável `MONGO_URL`
4. ✅ Pronto! A conexão está configurada automaticamente

#### Opção B: MongoDB Atlas (Recomendado para produção)

1. Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito (M0)
3. Configure o acesso:
   - Em **"Database Access"**, crie um usuário com senha
   - Em **"Network Access"**, adicione `0.0.0.0/0` (permitir de qualquer lugar)
4. Obtenha a Connection String:
   - Clique em **"Connect" → "Connect your application"**
   - Copie a string de conexão
   - Substitua `<password>` pela senha do usuário
5. No Railway, adicione a variável de ambiente:
   ```
   DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/contractic?retryWrites=true&w=majority
   ```

### 3. Configurar Variáveis de Ambiente

No painel do Railway, vá em **"Variables"** e adicione:

#### Variáveis Obrigatórias:

```bash
# Node Environment
NODE_ENV=production

# URL do Frontend (para CORS)
FRONTEND_URL=https://seu-frontend-url.vercel.app
```

#### Variáveis Opcionais (se não usar MongoDB do Railway):

```bash
# Apenas se usar MongoDB Atlas ou externo
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/contractic?retryWrites=true&w=majority
```

### 4. Configurar Build e Deploy

O Railway irá usar automaticamente as configurações dos arquivos:
- **`railway.json`** - Configurações de build e deploy
- **`nixpacks.toml`** - Configurações de ambiente e pacotes

#### Build Command (já configurado):
```bash
npm install && npm run build:backend
```

#### Start Command (já configurado):
```bash
npm run start:backend
```

### 5. Deploy Automático

1. O Railway irá iniciar o deploy automaticamente
2. Acompanhe os logs em tempo real no painel
3. Aguarde a mensagem: **"✅ MongoDB conectado com sucesso [PRODUÇÃO]"**
4. Quando concluído, você verá: **"🚀 Deployed successfully"**

### 6. Obter URL da API

1. No painel do Railway, clique em **"Settings"**
2. Em **"Domains"**, clique em **"Generate Domain"**
3. Copie a URL gerada (ex: `https://contraticmanage-production.up.railway.app`)
4. Sua API estará disponível em: `https://contraticmanage-production.up.railway.app/api`

### 7. Conectar Frontend

Atualize a variável `VITE_API_URL` no seu frontend (Vercel, Netlify, etc):

```bash
VITE_API_URL=https://contraticmanage-production.up.railway.app/api
```

E no Railway, atualize a variável `FRONTEND_URL`:

```bash
FRONTEND_URL=https://seu-frontend.vercel.app
```

## 🔍 Verificação de Deploy

### Testando a API

Acesse a URL da sua API para testar:

```bash
# Healthcheck básico (teste de conexão)
curl https://contraticmanage-production.up.railway.app/api/clientes

# Deve retornar JSON ou erro 401 (autenticação necessária)
```

### Logs do Railway

Para verificar logs em tempo real:
1. No painel Railway, clique na aba **"Deployments"**
2. Clique no deploy ativo
3. Veja os logs em tempo real

Logs esperados:
```
✅ MongoDB conectado com sucesso [PRODUÇÃO]
🚀 Ambiente: Railway/Produção
✓ Ready in XXXms
```

## 🔧 Troubleshooting

### Erro: "Cannot connect to MongoDB"

**Solução:**
1. Verifique se a variável `DATABASE_URL` ou `MONGO_URL` está configurada
2. Se usar MongoDB Atlas, verifique:
   - Network Access permite `0.0.0.0/0`
   - Usuário e senha estão corretos na connection string
   - Database name está na connection string

### Erro: "CORS blocked"

**Solução:**
1. Verifique se `FRONTEND_URL` no Railway está correto
2. Certifique-se de que a URL NÃO termina com `/`
3. Exemplo correto: `https://seu-frontend.vercel.app`
4. Exemplo errado: `https://seu-frontend.vercel.app/`

### Build falha

**Solução:**
1. Verifique se todos os arquivos estão commitados no Git
2. Execute localmente: `npm run build:backend`
3. Verifique os logs de build no Railway

### Erro: "Cannot find module"

**Solução:**
1. Certifique-se de que `package.json` inclui todas as dependências
2. No Railway, force um rebuild:
   - Vá em **"Deployments"**
   - Clique nos três pontos **"..."**
   - Selecione **"Redeploy"**

## 📊 Monitoramento

### Métricas no Railway

O Railway fornece automaticamente:
- **CPU Usage** - Uso de CPU
- **Memory Usage** - Uso de memória
- **Network** - Tráfego de rede
- **Logs** - Logs em tempo real

### Custos

Railway oferece:
- **$5 de crédito gratuito por mês** para Hobby Plan
- **$0.000231 por GB-hora** de RAM
- **$0.000463 por vCPU-hora**

Para aplicações pequenas, o plano gratuito é suficiente.

## 🔄 Atualizações Automáticas

O Railway está configurado para deploy automático:

1. Faça alterações no código
2. Commit e push para o repositório:
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```
3. O Railway detecta e faz deploy automaticamente
4. Acompanhe o progresso no painel

## 🛡️ Segurança

### Variáveis de Ambiente

- ✅ Nunca commite arquivos `.env` no Git
- ✅ Use variáveis de ambiente do Railway para dados sensíveis
- ✅ Mantenha credenciais de banco de dados seguras

### CORS

- ✅ Configure `FRONTEND_URL` apenas com domínios confiáveis
- ❌ Nunca use `*` (wildcard) em produção

### MongoDB

- ✅ Use senhas fortes para usuários do banco
- ✅ Restrinja acesso de rede quando possível
- ✅ Habilite autenticação no MongoDB

## 📚 Recursos Adicionais

- [Documentação Railway](https://docs.railway.app/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no Railway
2. Consulte este guia de troubleshooting
3. Verifique a documentação do Railway
4. Entre em contato com o suporte do Railway

---

**Boa sorte com seu deploy! 🚀**
