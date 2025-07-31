'use client'

export function Logo() {
  return (
    <div className="flex items-center space-x-6">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg">
        <div className="text-4xl">💰</div>
      </div>
      <div>
        <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          ISpent
        </h1>
        <p className="text-white/90 font-medium text-lg">
          Track your expenses with joy
        </p>
      </div>
    </div>
  );
} 