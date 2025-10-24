import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

function ProtectedRoute({ children }) {
  const { user, checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
