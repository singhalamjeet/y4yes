import { useState, useEffect } from 'react';
import { Shield, Globe, Activity, Search } from 'lucide-react';

// Configuration
const API_BASE = 'https://y4yes.com/api';
const API_KEY = 'y4yes_ext_secure_8829_key_v1';

function App() {
    const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
    const [inspection, setInspection] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [ipData, setIpData] = useState<{ ip: string; city?: string; country?: string }>({ ip: 'Loading...' });

    useEffect(() => {
        // Get current tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                setActiveTab(tabs[0]);
            }
        });

        // Fetch Public IP and Location with fallback
        const fetchIp = async () => {
            try {
                // Primary: ipwho.is (IP + Location)
                const res = await fetch('https://ipwho.is/');
                const data = await res.json();

                if (data.success !== false) {
                    setIpData({
                        ip: data.ip,
                        city: data.city,
                        country: data.country
                    });
                    return;
                }
            } catch (e) {
                console.error('Primary IP fetch failed:', e);
            }

            try {
                // Fallback: ipify (IP only)
                const res = await fetch('https://api.ipify.org?format=json');
                const data = await res.json();
                setIpData({ ip: data.ip });
            } catch (e) {
                console.error('Fallback IP fetch failed:', e);
                setIpData({ ip: 'Unknown' });
            }
        };

        fetchIp();
    }, []);

    const inspectCurrentTab = async () => {
        if (!activeTab?.url) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/inspect?url=${encodeURIComponent(activeTab.url)}`, {
                headers: { 'x-y4yes-key': API_KEY }
            });
            const data = await res.json();
            setInspection(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const openTool = (path: string) => {
        chrome.tabs.create({ url: `https://y4yes.com${path}` });
    };

    return (
        <div className="w-[350px] min-h-[400px] bg-zinc-950 text-white p-4 font-sans">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    y4yes
                </h1>
                <div className="text-xs text-zinc-500">Companion</div>
            </header>

            {/* Public IP & Location Display */}
            <div className="mb-6 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex justify-between items-center">
                <div>
                    <div className="text-xs text-zinc-500 mb-1">Your Public IP</div>
                    <div className="text-lg font-mono font-bold text-white leading-tight">{ipData.ip}</div>
                    {ipData.city && (
                        <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                            <span className="text-blue-400">📍</span>
                            {ipData.city}, {ipData.country}
                        </div>
                    )}
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>

            {/* Quick Search */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search query..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            openTool(`/supertool?q=${encodeURIComponent(search)}`);
                        }
                    }}
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                    onClick={() => openTool('/speed-test')}
                    className="flex flex-col items-center justify-center p-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors"
                >
                    <Activity className="w-6 h-6 text-green-400 mb-2" />
                    <span className="text-xs font-medium">Speed Test</span>
                </button>
                <button
                    onClick={() => openTool('/dns')}
                    className="flex flex-col items-center justify-center p-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition-colors"
                >
                    <Globe className="w-6 h-6 text-blue-400 mb-2" />
                    <span className="text-xs font-medium">DNS Lookup</span>
                </button>
            </div>

            {/* Inspect Tab */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        Inspect This Tab
                    </h2>
                    {!inspection && (
                        <button
                            onClick={inspectCurrentTab}
                            disabled={loading || !activeTab?.url?.startsWith('http')}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-xs rounded-full disabled:opacity-50"
                        >
                            {loading ? 'Scanning...' : 'Scan'}
                        </button>
                    )}
                </div>

                {activeTab && (
                    <div className="text-xs text-zinc-500 mb-3 truncate">
                        {activeTab.url}
                    </div>
                )}

                {inspection && (
                    <div className="space-y-2 text-sm animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                            <span className="text-zinc-400">HTTPS</span>
                            <span className={inspection.security.https ? 'text-green-400' : 'text-red-400'}>
                                {inspection.security.https ? 'Secure' : 'Insecure'}
                            </span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                            <span className="text-zinc-400">HSTS</span>
                            <span className={inspection.security.hsts ? 'text-green-400' : 'text-zinc-500'}>
                                {inspection.security.hsts ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">IP (IPv4)</span>
                            <span className="font-mono text-zinc-300">
                                {inspection.dns?.a?.[0] || 'Unknown'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
