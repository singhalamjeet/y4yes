import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          y4yes
        </Link>

        {/* Extension Banner */}
        <div className="hidden md:flex">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("The extension is currently under review by the Chrome Web Store. Check back soon!");
            }}
            className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-all hover:scale-105 group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: Get y4yes for Chrome
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </a>
        </div>

        <div className="flex gap-6 items-center text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <div className="relative group">
            <button className="hover:text-white transition-colors flex items-center gap-1">
              Tools
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <Link href="/dns" className="block px-4 py-2 hover:bg-zinc-800 transition-colors">DNS Lookup</Link>
              <Link href="/ip" className="block px-4 py-2 hover:bg-zinc-800 transition-colors">IP Lookup</Link>
              <Link href="/port-scan" className="block px-4 py-2 hover:bg-zinc-800 transition-colors">Port Scanner</Link>
              <Link href="/ping" className="block px-4 py-2 hover:bg-zinc-800 transition-colors">Ping Test</Link>
              <Link href="/ssl-check" className="block px-4 py-2 hover:bg-zinc-800 transition-colors">SSL Checker</Link>
              <Link href="/whois" className="block px-4 py-2 hover:bg-zinc-800 transition-colors">WHOIS Lookup</Link>
              <Link href="/supertool" className="block px-4 py-2 hover:bg-zinc-800 transition-colors border-t border-zinc-800">SuperTool (All-in-One)</Link>
            </div>
          </div>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <a
            href="https://buymeacoffee.com/y4yes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition-all hover:scale-105"
          >
            <span>☕</span>
            <span>Buy Me a Coffee</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
