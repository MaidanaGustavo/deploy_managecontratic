# ContraticManage - Sistema de Gestão de Contratos

## 🚀 Funcionalidades Implementadas

✅ **Autenticação Funcional**
- Sistema de login com validação
- Usuários mock para teste
- Redirecionamento automático após login
- Proteção de rotas (ProtectedRoute)
- Logout com limpeza de sessão

✅ **Página de Login**
- Design moderno e responsivo
- Validação de formulário
- Mensagens de erro
- Campos: email, senha, lembrar-me
- Botões de login social (visual)
- Link para esqueceu senha e cadastro

✅ **Dashboard**
- Navbar com informações do usuário
- Cards de estatísticas (Total de Contratos, Ativos, Pendentes, Valor Total)
- Tabela de contratos recentes
- Design responsivo
- Botão de logout funcional

## 👥 Usuários Mock para Teste

### Administrador
- **Email:** admin@exemplo.com
- **Senha:** admin123
- **Perfil:** admin

### Usuário Comum
- **Email:** usuario@exemplo.com
- **Senha:** user123
- **Perfil:** user

## 🛠️ Tecnologias Utilizadas

- **React** - Framework JavaScript
- **Vite** - Build tool
- **React Router DOM** - Gerenciamento de rotas
- **Tailwind CSS** - Framework CSS
- **Context API** - Gerenciamento de estado

## 📦 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar a aplicação:**
   - Abra o navegador em: http://localhost:5173

## 🔐 Fluxo de Autenticação

1. Usuário acessa `/` ou `/login`
2. Insere credenciais (use um dos usuários mock acima)
3. Sistema valida credenciais
4. Se válido: redireciona para `/dashboard`
5. Se inválido: exibe mensagem de erro
6. No dashboard, usuário pode fazer logout clicando em "Sair"

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── LoginPage.jsx       # Página de login
│   ├── Dashboard.jsx       # Página do dashboard
│   └── ProtectedRoute.jsx  # Componente para proteger rotas
├── context/
│   └── AuthContext.jsx     # Contexto de autenticação
├── App.jsx                 # Configuração de rotas
├── main.jsx                # Entry point
└── index.css               # Estilos Tailwind

## 🎨 Design

- **Cores principais:** Azul (#3B82F6) e Roxo (#9333EA)
- **Gradientes:** Utilizados em botões e cards
- **Responsividade:** Totalmente adaptável para mobile, tablet e desktop
- **Animações:** Transições suaves em hover e foco

## 📝 Notas

- Os dados do dashboard são mockados (estáticos) para demonstração
- A autenticação usa localStorage para persistência de sessão
- As senhas são armazenadas em texto simples (apenas para demonstração - não usar em produção)
- Em produção, implementar backend real com hash de senhas e JWT
