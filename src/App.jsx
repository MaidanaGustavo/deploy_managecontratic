import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import CadastrarCliente from './components/CadastrarCliente'
import CadastrarContrato from './components/CadastrarContrato'
import EditarContrato from './components/EditarContrato'
import ClientesContratos from './components/ClientesContratos'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cadastrar-cliente"
            element={
              <ProtectedRoute>
                <CadastrarCliente />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cadastrar-contrato"
            element={
              <ProtectedRoute>
                <CadastrarContrato />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes-contratos"
            element={
              <ProtectedRoute>
                <ClientesContratos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-contrato"
            element={
              <ProtectedRoute>
                <EditarContrato />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
