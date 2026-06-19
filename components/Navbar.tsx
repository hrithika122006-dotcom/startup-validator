export default function Navbar() {
  return (
    <nav className="bg-[#08130d] border-b border-green-900 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-700 flex items-center justify-center text-white font-bold">
            SV
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Startup Validator</h1>

            <p className="text-xs text-green-300">AI Business Intelligence</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

          <span className="text-sm text-green-200">Powered by AI</span>
        </div>
      </div>
    </nav>
  );
}
