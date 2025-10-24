# Portal do Cliente - ContraticManage

## 📋 Visão Geral

O Portal do Cliente é uma interface dedicada que permite aos clientes da empresa visualizarem seus contratos de forma segura e independente, sem acesso às funcionalidades administrativas do sistema.

## 🎯 Funcionalidades

### Para Clientes
- ✅ Login seguro usando email e CNPJ
- ✅ Dashboard personalizado com estatísticas
- ✅ Visualização de todos os contratos associados
- ✅ Detalhes completos de cada contrato
- ✅ Filtros por status (ativos/inativos)
- ✅ Impressão de contratos
- ✅ Interface responsiva e moderna

### Para Administradores
- ✅ Cadastro de clientes com email e CNPJ
- ✅ Criação de contratos associados aos clientes
- ✅ Controle total sobre contratos e clientes

## 🔐 Como Acessar

### Portal do Cliente
1. Acesse: `http://localhost:5178/cliente/login`
2. Ou clique em "Portal do Cliente" na página de login do administrador
3. Use suas credenciais:
   - **Email**: O email cadastrado pela empresa
   - **CNPJ**: Seu CNPJ (use como senha)

### Portal Administrativo
1. Acesse: `http://localhost:5178/login`
2. Use as credenciais de administrador:
   - Email: `admin@exemplo.com`
   - Senha: `admin123`

## 📱 Estrutura do Portal do Cliente

### 1. Tela de Login (`/cliente/login`)
- Campo de email
- Campo de CNPJ (formatado automaticamente)
- Link para voltar ao login administrativo
- Design moderno e intuitivo

### 2. Dashboard (`/cliente/dashboard`)
- **Informações da Empresa**: CNPJ, Email, Telefone
- **Estatísticas**:
  - Total de contratos
  - Contratos ativos
  - Contratos inativos
- **Filtros**: Todos, Ativos, Inativos
- **Lista de Contratos**: Cards clicáveis com informações resumidas

### 3. Detalhes do Contrato (`/cliente/contrato/:id`)
- Informações completas do contrato
- Conteúdo processado com variáveis substituídas
- Botão para imprimir
- Botão para baixar PDF (em desenvolvimento)
- Layout otimizado para impressão

## 🔒 Segurança

### Autenticação
- Sistema de autenticação separado para clientes
- Verificação de email + CNPJ
- Sessão persistente via localStorage
- Redirecionamento automático se não autenticado

### Controle de Acesso
- Clientes só visualizam seus próprios contratos
- Verificação de propriedade em cada requisição
- Rotas protegidas com ProtectedRoute
- Separação completa entre admin e cliente

## 🎨 Design

### Características
- Interface limpa e moderna
- Cores: Azul (#2563eb) como cor principal
- Componentes responsivos (mobile-first)
- Ícones SVG otimizados
- Animações suaves
- Estados de loading

### Tema
- Fundo: Cinza claro (#f9fafb)
- Cards: Branco com sombras suaves
- Badges de status: Verde (ativo), Cinza (inativo)
- Botões: Azul com hover effects

## 📊 Fluxo de Uso

### Para Clientes
```
1. Acessa /cliente/login
   ↓
2. Insere email e CNPJ
   ↓
3. Sistema valida credenciais
   ↓
4. Redireciona para /cliente/dashboard
   ↓
5. Visualiza estatísticas e contratos
   ↓
6. Clica em um contrato
   ↓
7. Visualiza detalhes completos
   ↓
8. Pode imprimir ou baixar
```

### Para Administradores (Preparação)
```
1. Login no portal administrativo
   ↓
2. Cadastra cliente (incluindo email e CNPJ)
   ↓
3. Cria contrato para o cliente
   ↓
4. Cliente pode acessar portal com suas credenciais
```

## 🔧 Configuração Técnica

### Rotas Criadas
```javascript
// Rotas do Cliente
/cliente/login                  → LoginCliente
/cliente/dashboard             → ClienteDashboard (protegida)
/cliente/contrato/:id          → ClienteContratoDetalhes (protegida)

// Rotas do Admin
/login                         → LoginPage
/dashboard                     → Dashboard (protegida)
/cadastrar-cliente            → CadastrarCliente (protegida)
/cadastrar-contrato           → CadastrarContrato (protegida)
/clientes-contratos           → ClientesContratos (protegida)
/editar-contrato              → EditarContrato (protegida)
```

### Componentes Criados
```
src/components/
├── LoginCliente.jsx              → Tela de login para clientes
├── ClienteDashboard.jsx          → Dashboard do cliente
└── ClienteContratoDetalhes.jsx   → Visualização de contrato
```

### AuthContext Adaptado
```javascript
// Suporta dois tipos de login:
login(email, password, isCliente = false)

// Roles:
- 'admin': Administrador
- 'user': Usuário
- 'cliente': Cliente
```

## 📝 Exemplo de Uso

### 1. Cadastrar um Cliente (Admin)
```javascript
// No portal administrativo
Razão Social: Empresa Exemplo Ltda
CNPJ: 12.345.678/0001-90
Email: contato@empresa.com
Telefone: (67) 99999-9999
```

### 2. Criar Contrato para o Cliente (Admin)
```javascript
Cliente: Empresa Exemplo Ltda
Título: Contrato de Prestação de Serviços
Status: ativo
Descrição: Contrato de serviços mensais
Conteúdo: [Template com variáveis dinâmicas]
```

### 3. Cliente Acessa o Portal
```javascript
// Em /cliente/login
Email: contato@empresa.com
CNPJ: 12.345.678/0001-90

// Dashboard mostrará:
- Informações da empresa
- Total de contratos: 1
- Contratos ativos: 1
- Lista com o contrato criado
```

## 🚀 Próximas Melhorias

### Sugeridas
- [ ] Download de contratos em PDF
- [ ] Assinatura digital de contratos
- [ ] Histórico de visualizações
- [ ] Notificações de novos contratos
- [ ] Chat de suporte
- [ ] Renovação automática de contratos
- [ ] Upload de documentos
- [ ] Área de arquivos anexos

## 📞 Suporte

Para dúvidas ou problemas:
1. Clientes devem entrar em contato com a empresa
2. Administradores podem ajustar configurações no portal admin

## 🔄 Atualizações

**Versão 1.0.0** (Janeiro 2025)
- Lançamento inicial do Portal do Cliente
- Sistema de autenticação separado
- Dashboard completo
- Visualização de contratos
- Funcionalidade de impressão

---

**Desenvolvido para ContraticManage**
