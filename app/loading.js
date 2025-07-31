export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait while we prepare your expense tracker.
          </p>
        </div>
      </div>
    </div>
  )
} 