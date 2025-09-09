import { useAuth } from '../contexts/AuthProvider'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <h1 className="text-5xl md:text-6xl font-bold text-indigo-600 animate-fadeIn">
        Welcome to Research+
      </h1>
      {user && (
        <p className="text-xl text-gray-700 animate-fadeIn">
          Hello, {user.name}! Glad to see you back.
        </p>
      )}
    </div>
  )
}
