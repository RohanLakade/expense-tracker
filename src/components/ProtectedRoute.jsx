import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

function ProtectedRoute({ children }) {
  const currentUserEmail = useSelector((state) => state.auth.currentUserEmail)

  if (!currentUserEmail) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute