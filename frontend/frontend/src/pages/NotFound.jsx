
import { Link } from 'react-router-dom'
export default function NotFound(){
  return (
    <div className="text-center mt-24">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
      <Link to="/projects" className="btn-primary">Go Home</Link>
    </div>
  )
}
