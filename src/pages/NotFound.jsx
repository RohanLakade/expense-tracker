import { Link } from 'react-router'
import './NotFound.scss'

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__card">
        <h1>404</h1>
        <p>This page doesn't exist.</p>
        <Link to="/dashboard">Go back home</Link>
      </div>
    </div>
  )
}

export default NotFound