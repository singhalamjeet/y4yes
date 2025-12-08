import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          y4yes
        </Link>
        <div className="flex gap-6 items-center text-sm font-medium text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
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
