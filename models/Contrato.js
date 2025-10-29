import mongoose from 'mongoose'

const ContratoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'Cliente é obrigatório'],
      index: true,
    },
    titulo: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      minlength: [3, 'Título deve ter no mínimo 3 caracteres'],
      maxlength: [200, 'Título deve ter no máximo 200 caracteres'],
    },
    descricao: {
      type: String,
      trim: true,
      maxlength: [1000, 'Descrição deve ter no máximo 1000 caracteres'],
    },
    status: {
      type: String,
      enum: {
        values: ['ativo', 'inativo', 'pendente', 'cancelado'],
        message: 'Status deve ser: ativo, inativo, pendente ou cancelado',
      },
      default: 'ativo',
      index: true,
    },
    conteudo: {
      type: String,
      required: [true, 'Conteúdo do contrato é obrigatório'],
    },
    dataVigencia: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) return true // Data de vigência é opcional
          return v >= new Date()
        },
        message: 'Data de vigência não pode ser no passado',
      },
    },
    variaveis: {
      type: Map,
      of: String,
      default: {},
    },
    versao: {
      type: Number,
      default: 1,
    },
    historicoVersoes: [
      {
        versao: Number,
        conteudo: String,
        variaveis: Map,
        dataModificacao: {
          type: Date,
          default: Date.now,
        },
        modificadoPor: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id
        ret.clienteId = ret.cliente
        delete ret._id
        delete ret.__v

        // Converte Map para Object para JSON
        if (ret.variaveis instanceof Map) {
          ret.variaveis = Object.fromEntries(ret.variaveis)
        }

        return ret
      },
    },
  }
)

// Índices compostos para melhorar performance
ContratoSchema.index({ cliente: 1, status: 1 })
ContratoSchema.index({ cliente: 1, createdAt: -1 })
ContratoSchema.index({ status: 1, dataVigencia: 1 })

// Hook pre-save para versionar contratos
ContratoSchema.pre('save', function (next) {
  if (this.isModified('conteudo') && !this.isNew) {
    // Adiciona versão anterior ao histórico
    this.historicoVersoes.push({
      versao: this.versao,
      conteudo: this.conteudo,
      variaveis: this.variaveis,
      dataModificacao: new Date(),
    })
    this.versao += 1
  }
  next()
})

// Método para popular informações do cliente
ContratoSchema.methods.populateCliente = async function () {
  await this.populate('cliente', '-senha')
  return this
}

// Método para processar template com variáveis
ContratoSchema.methods.processarTemplate = function () {
  let conteudoProcessado = this.conteudo

  // Substitui variáveis no formato {{variavel}}
  this.variaveis.forEach((valor, chave) => {
    const regex = new RegExp(`{{${chave}}}`, 'g')
    conteudoProcessado = conteudoProcessado.replace(regex, valor)
  })

  // Adiciona data atual se solicitado
  conteudoProcessado = conteudoProcessado.replace(
    /{{data_atual}}/g,
    new Date().toLocaleDateString('pt-BR')
  )

  return conteudoProcessado
}

// Método para obter versão específica do contrato
ContratoSchema.methods.obterVersao = function (numeroVersao) {
  if (numeroVersao === this.versao) {
    return {
      versao: this.versao,
      conteudo: this.conteudo,
      variaveis: this.variaveis,
      dataModificacao: this.updatedAt,
    }
  }

  return this.historicoVersoes.find((v) => v.versao === numeroVersao)
}

// Método estático para buscar contratos por cliente com paginação
ContratoSchema.statics.buscarPorClientePaginado = async function (
  clienteId,
  { page = 1, limit = 10, status = null }
) {
  const query = { cliente: clienteId }
  if (status) {
    query.status = status
  }

  const skip = (page - 1) * limit

  const [contratos, total] = await Promise.all([
    this.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    this.countDocuments(query),
  ])

  return {
    contratos,
    paginacao: {
      paginaAtual: page,
      totalPaginas: Math.ceil(total / limit),
      totalItens: total,
      itensPorPagina: limit,
    },
  }
}

// Método estático para buscar contratos próximos ao vencimento
ContratoSchema.statics.buscarProximosVencimento = async function (dias = 30) {
  const dataLimite = new Date()
  dataLimite.setDate(dataLimite.getDate() + dias)

  return this.find({
    status: 'ativo',
    dataVigencia: {
      $gte: new Date(),
      $lte: dataLimite,
    },
  })
    .populate('cliente', 'razaoSocial email')
    .sort({ dataVigencia: 1 })
}

// Previne redefinição do modelo em hot reload
export default mongoose.models.Contrato || mongoose.model('Contrato', ContratoSchema)
