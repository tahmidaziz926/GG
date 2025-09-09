export default function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-4 overflow-auto">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div
        className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full p-6 z-10 animate-fadeIn`}
        style={{ marginTop: '80px' }} // offset below navbar
      >
        {/* Header with title and close button */}
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-20">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal content */}
        <div>{children}</div>
      </div>
    </div>
  )
}
