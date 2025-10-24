/**
 * EXEMPLO DE INTEGRAÇÃO COM LIQUID.JS
 *
 * Para usar Liquid no projeto, execute:
 * npm install liquidjs
 */

import { Liquid } from 'liquidjs'
import { prepareForTemplateEngine, extractVariables } from '../utils/templateProcessor'

/**
 * Processa um contrato usando Liquid.js
 *
 * @example
 * const contratoHtml = editor.getHTML() // HTML do TipTap
 * const dadosCliente = {
 *   nome_cliente: 'Empresa XYZ Ltda',
 *   cnpj: '12.345.678/0001-90',
 *   valor_contrato: 'R$ 50.000,00',
 *   data_contrato: '24/10/2025'
 * }
 *
 * const contratoFinal = await processarContratoComLiquid(contratoHtml, dadosCliente)
 */
export async function processarContratoComLiquid(contratoHtml, dados) {
  // 1. Remove os elementos HTML do TipTap, deixando apenas {{variavel}}
  const templateLimpo = prepareForTemplateEngine(contratoHtml)

  // 2. Cria instância do Liquid
  const engine = new Liquid()

  // 3. Processa o template com os dados
  const resultado = await engine.parseAndRender(templateLimpo, dados)

  return resultado
}

/**
 * Exemplo completo de fluxo de processamento
 */
export async function exemploCompleto() {
  // Simula o HTML que vem do editor TipTap
  const contratoTipTap = `
    <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
    <p>
      Este contrato é firmado entre
      <span data-type="variable" data-id="nome_cliente" data-label="nome_cliente">{{nome_cliente}}</span>
      , inscrito no CNPJ sob o nº
      <span data-type="variable" data-id="cnpj" data-label="cnpj">{{cnpj}}</span>
      , doravante denominado CONTRATANTE.
    </p>
    <p>
      O valor total do contrato é de
      <span data-type="variable" data-id="valor_contrato" data-label="valor_contrato">{{valor_contrato}}</span>
      , a ser pago até a data
      <span data-type="variable" data-id="data_pagamento" data-label="data_pagamento">{{data_pagamento}}</span>
      .
    </p>
  `

  // Extrai as variáveis usadas
  const variaveisUsadas = extractVariables(contratoTipTap)
  console.log('Variáveis encontradas:', variaveisUsadas)
  // Output: ['nome_cliente', 'cnpj', 'valor_contrato', 'data_pagamento']

  // Dados reais do cliente
  const dadosCliente = {
    nome_cliente: 'ACME Corporation Ltda',
    cnpj: '12.345.678/0001-90',
    valor_contrato: 'R$ 50.000,00',
    data_pagamento: '30/11/2025'
  }

  // Processa com Liquid
  const contratoFinal = await processarContratoComLiquid(contratoTipTap, dadosCliente)

  console.log('Contrato processado:', contratoFinal)

  return contratoFinal
}

/**
 * Exemplo com recursos avançados do Liquid (loops, condicionais, filtros)
 */
export async function exemploAvancado() {
  const engine = new Liquid()

  // Template com recursos avançados do Liquid
  const template = `
    <h1>CONTRATO</h1>

    <p>Cliente: {{cliente.nome | upcase}}</p>
    <p>CNPJ: {{cliente.cnpj}}</p>

    {% if cliente.tipo == 'premium' %}
      <p><strong>Cliente Premium - Desconto de 10%</strong></p>
    {% endif %}

    <h2>Itens do Contrato:</h2>
    <ul>
    {% for item in itens %}
      <li>{{item.descricao}} - R$ {{item.valor}}</li>
    {% endfor %}
    </ul>

    <p>Total: R$ {{total | round: 2}}</p>
    <p>Data: {{data | date: "%d/%m/%Y"}}</p>
  `

  const dados = {
    cliente: {
      nome: 'Empresa XYZ',
      cnpj: '12.345.678/0001-90',
      tipo: 'premium'
    },
    itens: [
      { descricao: 'Consultoria', valor: '5000.00' },
      { descricao: 'Desenvolvimento', valor: '15000.00' },
      { descricao: 'Manutenção', valor: '3000.00' }
    ],
    total: 23000.00,
    data: new Date()
  }

  const resultado = await engine.parseAndRender(template, dados)
  return resultado
}

/**
 * Como integrar no serviço de contratos
 */
export async function salvarContratoComProcessamento(contratoData, clienteData) {
  // 1. Pega o HTML do editor
  const htmlEditor = contratoData.conteudo

  // 2. Prepara dados para substituição
  const dados = {
    nome_cliente: clienteData.razaoSocial,
    cnpj: clienteData.cnpj,
    email: clienteData.email,
    telefone: clienteData.telefone,
    data_atual: new Date().toLocaleDateString('pt-BR'),
    numero_contrato: `CONT-${Date.now()}`,
    // ... outros campos
  }

  // 3. Processa o template
  const contratoProcessado = await processarContratoComLiquid(htmlEditor, dados)

  // 4. Salva no banco (ou localStorage)
  const contratoParaSalvar = {
    ...contratoData,
    conteudoOriginal: htmlEditor, // Template com variáveis
    conteudoProcessado: contratoProcessado, // HTML final
    variaveis: extractVariables(htmlEditor), // Lista de variáveis
    dadosUsados: dados // Dados usados na substituição
  }

  return contratoParaSalvar
}

// Exporta tudo
export default {
  processarContratoComLiquid,
  exemploCompleto,
  exemploAvancado,
  salvarContratoComProcessamento
}
