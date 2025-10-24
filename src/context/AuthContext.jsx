import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Usuários mock para teste
const mockUsers = [
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

  const login = (email, password) => {
    // Busca o usuário nos dados mock
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    )

    if (foundUser) {
      // Remove a senha antes de armazenar
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)

      // Armazena no localStorage para persistência
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))

      return { success: true }
    }

    return { success: false, error: 'Email ou senha inválidos' }
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
