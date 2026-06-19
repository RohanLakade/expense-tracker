import { Component } from 'react'
import './ErrorBoundary.scss'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__card">
            <h1>Something went wrong</h1>
            <p>Please refresh the page and try again.</p>
            <button onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary