// Utilitário para processar templates com variáveis
// Compatível com Liquid, Handlebars, Mustache e outras engines

/**
 * Extrai variáveis do HTML gerado pelo TipTap
 * @param {string} html - HTML do contrato
 * @returns {string[]} - Array com os nomes das variáveis encontradas
 */
export function extractVariables(html) {
  const variables = []
  const regex = /\{\{([^}]+)\}\}/g
  let match

  while ((match = regex.exec(html)) !== null) {
    const varName = match[1].trim()
    if (!variables.includes(varName)) {
      variables.push(varName)
    }
  }

  return variables
}

/**
 * Substitui as variáveis no template com valores reais
 * Compatível com o formato {{variavel}} usado por Liquid, Handlebars, etc.
 *
 * @param {string} template - Template HTML com variáveis
 * @param {Object} data - Objeto com os valores das variáveis
 * @returns {string} - HTML com variáveis substituídas
 *
 * @example
 * const template = '<p>Cliente: {{nome_cliente}}, Valor: {{valor_contrato}}</p>'
 * const data = { nome_cliente: 'Empresa XYZ', valor_contrato: 'R$ 10.000,00' }
 * const resultado = processTemplate(template, data)
 * // Resultado: '<p>Cliente: Empresa XYZ, Valor: R$ 10.000,00</p>'
 */
export function processTemplate(template, data) {
  let processed = template

  // Remove os elementos span do TipTap mantendo apenas o conteúdo {{variavel}}
  processed = processed.replace(
    /<span[^>]*data-type="variable"[^>]*>\{\{([^}]+)\}\}<\/span>/g,
    '{{$1}}'
  )

  // Substitui as variáveis pelos valores
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    processed = processed.replace(regex, data[key] || '')
  })

  return processed
}

/**
 * Para usar com Liquid.js (instale: npm install liquidjs)
 *
 * @example
 * import { Liquid } from 'liquidjs'
 *
 * async function processWithLiquid(template, data) {
 *   const engine = new Liquid()
 *
 *   // Remove os spans do TipTap
 *   const cleanTemplate = template.replace(
 *     /<span[^>]*data-type="variable"[^>]*>(\{\{[^}]+\}\})<\/span>/g,
 *     '$1'
 *   )
 *
 *   // Processa com Liquid
 *   const result = await engine.parseAndRender(cleanTemplate, data)
 *   return result
 * }
 */

/**
 * Prepara o template do TipTap para uso com engines de template
 * Remove os elementos HTML específicos do editor mantendo apenas o formato {{variavel}}
 *
 * @param {string} tiptapHtml - HTML gerado pelo TipTap
 * @returns {string} - Template limpo pronto para Liquid/Handlebars/etc
 */
export function prepareForTemplateEngine(tiptapHtml) {
  return tiptapHtml.replace(
    /<span[^>]*data-type="variable"[^>]*data-label="([^"]+)"[^>]*>\{\{[^}]+\}\}<\/span>/g,
    '{{$1}}'
  )
}

/**
 * Gera dados de exemplo baseados nas variáveis do contrato
 * Útil para preview do contrato
 *
 * @param {string[]} variables - Array de nomes de variáveis
 * @param {Object} clienteData - Dados do cliente selecionado
 * @returns {Object} - Objeto com valores de exemplo para cada variável
 */
export function generateSampleData(variables, clienteData = {}) {
  const sampleData = {}

  variables.forEach(varName => {
    const lowerVar = varName.toLowerCase()

    // Mapeia variáveis comuns para dados do cliente
    if (lowerVar.includes('nome') || lowerVar.includes('cliente')) {
      sampleData[varName] = clienteData.razaoSocial || 'Nome do Cliente'
    } else if (lowerVar.includes('cnpj')) {
      sampleData[varName] = clienteData.cnpj || '00.000.000/0000-00'
    } else if (lowerVar.includes('email')) {
      sampleData[varName] = clienteData.email || 'email@exemplo.com'
    } else if (lowerVar.includes('telefone')) {
      sampleData[varName] = clienteData.telefone || '(00) 00000-0000'
    } else if (lowerVar.includes('endereco') || lowerVar.includes('endereço')) {
      sampleData[varName] = clienteData.endereco || 'Endereço do Cliente'
    } else if (lowerVar.includes('data')) {
      sampleData[varName] = new Date().toLocaleDateString('pt-BR')
    } else if (lowerVar.includes('valor')) {
      sampleData[varName] = 'R$ 0,00'
    } else if (lowerVar.includes('numero') || lowerVar.includes('número')) {
      sampleData[varName] = '001/2025'
    } else {
      sampleData[varName] = `[${varName}]`
    }
  })

  return sampleData
}

export default {
  extractVariables,
  processTemplate,
  prepareForTemplateEngine,
  generateSampleData,
}
