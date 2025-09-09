import { useAuth } from '../contexts/AuthProvider'

export default function Profile() {
  const { user } = useAuth()
  
  if (!user) return (
    <div className="p-6 card text-center">
      <div className="text-gray-500 text-lg">Not logged in</div>
      <p className="text-sm text-gray-400 mt-2">Please sign in to view your profile</p>
    </div>
  )

  // Role-based color coding
  const roleColors = {
    admin: 'bg-red-100 text-red-800 border-red-200',
    researcher: 'bg-blue-100 text-blue-800 border-blue-200',
    reviewer: 'bg-purple-100 text-purple-800 border-purple-200'
  }

  const roleIcon = {
    admin: '👑',
    researcher: '🔬', 
    reviewer: '📝'
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">User Profile</h1>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${roleColors[user.role] || 'bg-gray-100 text-gray-800'}`}>
          <span>{roleIcon[user.role] || '👤'}</span>
          <span className="font-medium capitalize">{user.role}</span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="card p-6 space-y-6">
        {/* Personal Information Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Personal Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Full Name</p>
              <p className="text-lg font-semibold text-gray-800">{user.name || 'Not provided'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">User ID</p>
              <p className="text-lg font-semibold text-gray-800">#{user.user_id}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 font-medium">Account Type</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">System Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Profile last updated: {new Date().toLocaleDateString()}</p>
            <p>Account status: <span className="text-green-600 font-medium">Active</span></p>
            <p>Member since: {new Date().getFullYear() - 1}-01-01</p>
          </div>
        </div>
      </div>
    </div>
  )
}
