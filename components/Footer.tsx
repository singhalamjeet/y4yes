export function Footer() {
    return (
        <footer className="border-t border-zinc-800 bg-black py-8 mt-auto">
            <div className="container mx-auto px-4 text-center text-zinc-500 text-sm">
                <p>&copy; {new Date().getFullYear()} y4yes.com. All rights reserved.</p>
                <p className="mt-2">Simple, fast, and secure network tools.</p>
            </div>
        </footer>
    );
}
