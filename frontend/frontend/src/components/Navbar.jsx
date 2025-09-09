import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import { useState } from 'react';
import ChartModal from './ChartModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false); // new state for metrics

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo now links to /home */}
          <Link to="/home" className="flex items-center gap-2 text-xl font-bold text-indigo-700">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              R+
            </div>
            Research+
          </Link>

          <div className="desktop-nav flex items-center gap-4">
            {user ? (
              <>
                <NavLink
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-all ${
                      isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`
                  }
                  to="/projects"
                >
                  Projects
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-all ${
                      isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`
                  }
                  to="/papers"
                >
                  Papers
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-all ${
                      isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`
                  }
                  to="/datasets"
                >
                  Datasets
                </NavLink>

                {/* Metrics / Chart Button */}
                <button
                  className="px-3 py-2 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                  onClick={() => setShowMetrics(true)}
                >
                  Metrics
                </button>

                {user.role === 'researcher' && (
                  <NavLink
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg transition-all ${
                        isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                      }`
                    }
                    to="/home"
                  >
                    Home
                  </NavLink>
                )}

                {user.role === 'reviewer' && (
                  <NavLink
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg transition-all ${
                        isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                      }`
                    }
                    to="/reviews"
                  >
                    Reviews
                  </NavLink>
                )}

                {user.role === 'admin' && (
                  <NavLink
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg transition-all ${
                        isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                      }`
                    }
                    to="/admin"
                  >
                    Admin
                  </NavLink>
                )}

                <NavLink
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg transition-all ${
                      isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`
                  }
                  to="/profile"
                >
                  Profile
                </NavLink>

                <button className="btn-primary" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink className="link" to="/login">
                  Login
                </NavLink>
                <NavLink className="btn-primary" to="/register">
                  Create account
                </NavLink>
              </>
            )}
          </div>

          {/* mobile nav code omitted for brevity */}
        </div>
      </nav>

      {/* Metrics Modal */}
      {showMetrics && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <ChartModal open={true} onClose={() => setShowMetrics(false)} />
        </div>
      )}
    </>
  );
}
