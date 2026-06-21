export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Startup Validator</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/validate"
            className="text-sm hover:text-blue-400 transition-all"
          >
            Validate Idea
          </a>
          <a
            href="/history"
            className="text-sm hover:text-blue-400 transition-all"
          >
            My Ideas
          </a>
        </div>
      </div>
    </nav>
  );
}
