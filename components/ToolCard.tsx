import Link from 'next/link';

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon?: React.ReactNode;
}

export function ToolCard({ title, description, href, icon }: ToolCardProps) {
    return (
        <Link href={href} className="block group">
            <div className="h-full p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900/80 transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                        {title}
                    </h3>
                    {icon && <div className="text-zinc-400 group-hover:text-blue-400 transition-colors">{icon}</div>}
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                    {description}
                </p>
            </div>
        </Link>
    );
}
