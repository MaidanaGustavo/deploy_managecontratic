# Variáveis Dinâmicas no Editor de Contratos

## Como Funciona

O sistema permite criar **variáveis dinâmicas** digitando `{{nome_da_variavel}}` diretamente no editor. As variáveis são automaticamente convertidas em badges azuis destacados.

### Exemplo

```
Este contrato é firmado com {{nome_cliente}}, CNPJ {{cnpj}}.
O valor é de {{valor_contrato}}.
```

As variáveis `{{nome_cliente}}`, `{{cnpj}}` e `{{valor_contrato}}` serão automaticamente convertidas em badges azuis.

---

## Integração com Template Engines (Liquid, Handlebars, Mustache)

O formato `{{variavel}}` é compatível com diversas engines de template. Isso permite:

1. **Criar templates de contratos** no editor com variáveis
2. **Salvar o template** no banco de dados
3. **Processar o template** quando precisar gerar o contrato final
4. **Substituir as variáveis** com dados reais do cliente

### Usando com Liquid.js

#### 1. Instalação

```bash
npm install liquidjs
```

#### 2. Uso Básico

```javascript
import { processarContratoComLiquid } from './examples/liquidIntegration'

// HTML do editor TipTap
const contratoHtml = editor.getHTML()

// Dados do cliente
const dados = {
  nome_cliente: 'Empresa XYZ Ltda',
  cnpj: '12.345.678/0001-90',
  valor_contrato: 'R$ 50.000,00',
  data_pagamento: '30/11/2025'
}

// Processa o template
const contratoFinal = await processarContratoComLiquid(contratoHtml, dados)
```

#### 3. Recursos Avançados do Liquid

O Liquid oferece recursos poderosos:

```liquid
{# Condicionais #}
{% if cliente.tipo == 'premium' %}
  <p>Cliente Premium - Desconto de 10%</p>
{% endif %}

{# Loops #}
{% for item in itens %}
  <li>{{item.descricao}} - R$ {{item.valor}}</li>
{% endfor %}

{# Filtros #}
<p>Nome: {{cliente.nome | upcase}}</p>
<p>Data: {{data | date: "%d/%m/%Y"}}</p>
```

---

## Funções Utilitárias

### `extractVariables(html)`

Extrai todas as variáveis de um HTML:

```javascript
import { extractVariables } from './utils/templateProcessor'

const html = '<p>Cliente: {{nome_cliente}}, Valor: {{valor}}</p>'
const variaveis = extractVariables(html)
// Retorna: ['nome_cliente', 'valor']
```

### `processTemplate(template, data)`

Substitui variáveis sem bibliotecas externas (substituição simples):

```javascript
import { processTemplate } from './utils/templateProcessor'

const template = '<p>Cliente: {{nome_cliente}}</p>'
const dados = { nome_cliente: 'Empresa XYZ' }
const resultado = processTemplate(template, dados)
// Retorna: '<p>Cliente: Empresa XYZ</p>'
```

### `prepareForTemplateEngine(tiptapHtml)`

Prepara o HTML do TipTap para uso com engines de template:

```javascript
import { prepareForTemplateEngine } from './utils/templateProcessor'

// Remove os elementos <span> do TipTap mantendo apenas {{variavel}}
const templateLimpo = prepareForTemplateEngine(editor.getHTML())
```

### `generateSampleData(variables, clienteData)`

Gera dados de exemplo para preview:

```javascript
import { generateSampleData } from './utils/templateProcessor'

const variaveis = ['nome_cliente', 'cnpj', 'valor_contrato']
const clienteData = { razaoSocial: 'Empresa XYZ', cnpj: '12.345.678/0001-90' }

const dadosExemplo = generateSampleData(variaveis, clienteData)
// Retorna dados mapeados automaticamente
```

---

## Fluxo Completo de Uso

### 1. Criação do Template

```javascript
// Usuário digita no editor:
// "Contrato firmado com {{nome_cliente}}, CNPJ {{cnpj}}."

const templateHtml = editor.getHTML()
// Salva no banco de dados como template
```

### 2. Geração do Contrato

```javascript
import { processarContratoComLiquid } from './examples/liquidIntegration'
import contratoService from './services/contratoService'
import clienteService from './services/clienteService'

async function gerarContrato(contratoId, clienteId) {
  // 1. Busca o template salvo
  const contrato = await contratoService.buscarPorId(contratoId)
  const cliente = await clienteService.buscarPorId(clienteId)

  // 2. Prepara os dados
  const dados = {
    nome_cliente: cliente.razaoSocial,
    cnpj: cliente.cnpj,
    email: cliente.email,
    telefone: cliente.telefone,
    data_atual: new Date().toLocaleDateString('pt-BR'),
    numero_contrato: `CONT-${Date.now()}`
  }

  // 3. Processa com Liquid
  const contratoFinal = await processarContratoComLiquid(
    contrato.conteudoOriginal,
    dados
  )

  // 4. Retorna HTML pronto para exibir/imprimir/enviar
  return contratoFinal
}
```

### 3. Salvando Template e Dados

```javascript
import { salvarContratoComProcessamento } from './examples/liquidIntegration'

async function salvarContrato(editor, cliente) {
  const contratoData = {
    clienteId: cliente.id,
    conteudo: editor.getHTML()
  }

  // Salva template + versão processada + metadados
  const contratoCompleto = await salvarContratoComProcessamento(
    contratoData,
    cliente
  )

  // contratoCompleto contém:
  // - conteudoOriginal: template com {{variaveis}}
  // - conteudoProcessado: HTML final
  // - variaveis: ['nome_cliente', 'cnpj', ...]
  // - dadosUsados: { nome_cliente: '...', cnpj: '...' }
}
```

---

## Alternativas ao Liquid

### Handlebars

```bash
npm install handlebars
```

```javascript
import Handlebars from 'handlebars'
import { prepareForTemplateEngine } from './utils/templateProcessor'

const templateLimpo = prepareForTemplateEngine(contratoHtml)
const template = Handlebars.compile(templateLimpo)
const resultado = template(dados)
```

### Mustache

```bash
npm install mustache
```

```javascript
import Mustache from 'mustache'
import { prepareForTemplateEngine } from './utils/templateProcessor'

const templateLimpo = prepareForTemplateEngine(contratoHtml)
const resultado = Mustache.render(templateLimpo, dados)
```

---

## Vantagens do Sistema

✅ **Flexível**: Crie quantas variáveis precisar, com qualquer nome
✅ **Visual**: Variáveis destacadas em azul no editor
✅ **Compatível**: Funciona com Liquid, Handlebars, Mustache, etc.
✅ **Simples**: Apenas digite `{{nome}}` e pronto
✅ **Poderoso**: Use recursos avançados das engines (loops, condicionais, filtros)
✅ **Reutilizável**: Um template serve para múltiplos contratos

---

## Arquivos Criados

- `src/extensions/VariableNode.js` - Extensão TipTap para variáveis
- `src/extensions/VariableComponent.jsx` - Componente React para renderizar badges
- `src/utils/templateProcessor.js` - Utilitários para processar templates
- `src/examples/liquidIntegration.js` - Exemplos de integração com Liquid
- `VARIAVEIS_DINAMICAS.md` - Esta documentação

---

## Próximos Passos Sugeridos

1. **Instalar Liquid.js**: `npm install liquidjs`
2. **Criar templates reutilizáveis** de contratos padrão
3. **Implementar preview** do contrato com dados reais
4. **Adicionar biblioteca de templates** pré-prontos
5. **Exportar contratos** em PDF usando puppeteer ou similar
