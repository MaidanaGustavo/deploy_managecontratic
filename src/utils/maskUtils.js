// Utilitários para máscaras de entrada

// Máscara para CNPJ (00.000.000/0000-00)
export const maskCNPJ = (value) => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '')

  // Aplica a máscara conforme o usuário digita
  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  } else if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  } else {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
  }
}

// Remove a máscara do CNPJ (retorna apenas números)
export const unmaskCNPJ = (value) => {
  return value.replace(/\D/g, '')
}

// Valida CNPJ (validação básica de formato)
export const isValidCNPJ = (cnpj) => {
  const numbers = unmaskCNPJ(cnpj)

  // Verifica se tem 14 dígitos
  if (numbers.length !== 14) {
    return false
  }

  // Verifica se não são todos números iguais
  if (/^(\d)\1+$/.test(numbers)) {
    return false
  }

  // Validação dos dígitos verificadores
  let tamanho = numbers.length - 2
  let numeros = numbers.substring(0, tamanho)
  const digitos = numbers.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false
  }

  tamanho = tamanho + 1
  numeros = numbers.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false
  }

  return true
}

// Formata CNPJ para exibição (garante que está sempre formatado)
export const formatCNPJ = (value) => {
  if (!value) return ''
  return maskCNPJ(value)
}

// Máscara para Telefone (00) 00000-0000 ou (00) 0000-0000
export const maskTelefone = (value) => {
  const numbers = value.replace(/\D/g, '')

  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }
}

// Formata Telefone para exibição
export const formatTelefone = (value) => {
  if (!value) return ''
  return maskTelefone(value)
}

// Máscara para CEP (00000-000)
export const maskCEP = (value) => {
  const numbers = value.replace(/\D/g, '')

  if (numbers.length <= 5) {
    return numbers
  } else {
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }
}

// Formata CEP para exibição
export const formatCEP = (value) => {
  if (!value) return ''
  return maskCEP(value)
}
