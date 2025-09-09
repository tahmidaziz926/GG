import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-800 rounded-2xl p-8 text-white mb-8">
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Research+ Labs</h1>
        <p className="text-xl mb-8 opacity-90">Advanced research management platform for modern laboratories</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/projects" className="btn-primary bg-white text-indigo-700 hover:bg-gray-100">
            Explore Projects
          </Link>
          <Link to="/papers" className="btn border-2 border-white text-white hover:bg-white hover:text-indigo-700">
            View Research Papers
          </Link>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="70" cy="30" r="20" fill="white" />
          <circle cx="30" cy="70" r="15" fill="white" />
          <rect x="60" y="60" width="25" height="25" fill="white" />
        </svg>
      </div>
    </div>
  )
}