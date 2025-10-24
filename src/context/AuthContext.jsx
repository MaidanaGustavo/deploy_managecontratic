import { createContext, useContext, useState } from 'react'
import clienteService from '../services/clienteService'

const AuthContext = createContext(null)

// Usuários admin mock para teste
const mockAdminUsers = [
  {
    id: 1,
    email: 'admin@exemplo.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: 2,
    email: 'usuario@exemplo.com',
    password: 'user123',
    name: 'Usuário Teste',
    role: 'user'
  }
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = async (email, password, isCliente = false) => {
    if (isCliente) {
      // Login de cliente - busca nos clientes cadastrados
      try {
        const clientes = await clienteService.listar()
        const cliente = clientes.find(
          c => c.email === email && c.senha === password
        )

        if (cliente) {
          const clienteUser = {
            id: cliente.id,
            email: cliente.email,
            name: cliente.razaoSocial,
            role: 'cliente',
            clienteId: cliente.id,
            cnpj: cliente.cnpj
          }
          setUser(clienteUser)
          localStorage.setItem('user', JSON.stringify(clienteUser))
          return { success: true }
        }
        return { success: false, error: 'Email ou senha inválidos' }
      } catch (error) {
        return { success: false, error: 'Erro ao fazer login' }
      }
    } else {
      // Login de admin/usuário - busca nos dados mock
      const foundUser = mockAdminUsers.find(
        u => u.email === email && u.password === password
      )

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))
        return { success: true }
      }
      return { success: false, error: 'Email ou senha inválidos' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  // Verifica se há usuário logado ao carregar
  const checkAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
