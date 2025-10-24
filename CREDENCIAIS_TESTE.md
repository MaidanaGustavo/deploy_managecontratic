# 🔑 Credenciais para Teste - Portal do Cliente

## 📋 Como Fazer Login no Portal do Cliente

Acesse: **http://localhost:5178/cliente/login**

Use **Email + Senha** como credenciais

---

## 👥 Clientes Mockados Disponíveis

### 1️⃣ Tech Solutions Ltda
- **Email**: `contato@techsolutions.com`
- **Senha**: `tech123`
- **Contratos**: 2 ativos
  - Contrato de Prestação de Serviços - Tech Solutions
  - Contrato de Suporte Técnico

### 2️⃣ Comercial Silva & Cia
- **Email**: `contato@comercialsilva.com`
- **Senha**: `silva123`
- **Contratos**: 1 ativo + 1 inativo
  - Contrato de Fornecimento - Comercial Silva (ativo)
  - Contrato de Manutenção - Encerrado (inativo)

### 3️⃣ Empresa Demo Teste
- **Email**: `demo@empresa.com`
- **Senha**: `demo123`
- **Contratos**: 1 ativo
  - Contrato de Consultoria - Demo

---

## 🎯 Exemplo de Teste Rápido

1. **Acesse**: http://localhost:5178/cliente/login

2. **Use estas credenciais**:
   ```
   Email: contato@techsolutions.com
   Senha: tech123
   ```

3. **Você verá**:
   - Dashboard com estatísticas
   - Total: 2 contratos
   - Ativos: 2
   - Lista com os 2 contratos

4. **Clique em um contrato** para ver:
   - Detalhes completos
   - Conteúdo com variáveis substituídas
   - Opções de imprimir/baixar

---

## 🔐 Portal Administrativo

Para acessar como admin e gerenciar clientes/contratos:

**URL**: http://localhost:5178/login

**Credenciais Admin**:
- Email: `admin@exemplo.com`
- Senha: `admin123`

---

## 💡 Dicas

### Testando Diferentes Cenários

**Cliente com 2 contratos ativos**:
- Email: `contato@techsolutions.com`
- Senha: `tech123`

**Cliente com contratos ativos E inativos**:
- Email: `contato@comercialsilva.com`
- Senha: `silva123`

**Cliente com apenas 1 contrato**:
- Email: `demo@empresa.com`
- Senha: `demo123`

---

## 📱 Funcionalidades Testáveis

### No Dashboard
- ✅ Ver estatísticas (total, ativos, inativos)
- ✅ Filtrar contratos por status
- ✅ Clicar em contrato para ver detalhes

### Nos Detalhes do Contrato
- ✅ Ver informações completas
- ✅ Ver conteúdo com variáveis substituídas
- ✅ Imprimir contrato (Ctrl+P ou botão)
- ✅ Layout otimizado para impressão

### Segurança
- ✅ Cliente só vê seus próprios contratos
- ✅ Tentativa de acessar contrato de outro cliente = erro
- ✅ Logout seguro

---

## 🚀 Próximo Passo

**Limpe o localStorage para recarregar os dados mock**:
```javascript
// Cole no console do navegador:
localStorage.clear()
location.reload()
```

Isso garantirá que os dados mockados sejam carregados novamente!

---

**Desenvolvido para ContraticManage** 🎉
