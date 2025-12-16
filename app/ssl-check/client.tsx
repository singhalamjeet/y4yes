'use client';

import { useState } from 'react';

interface SSLResult {
    valid: boolean;
    validFrom: string;
    validTo: string;
    daysRemaining: number;
    issuer: any;
    subject?: any;
    bits?: number;
    protocol?: string;
}

export default function SslClient() {
    const [domain, setDomain] = useState('');
    const [result, setResult] = useState<SSLResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLookup = async () => {
        if (!domain) return;
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch(`/api/ssl?domain=${encodeURIComponent(domain)}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to check SSL');
            }

            setResult(data.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusIcon = (isValid: boolean) => {
        return isValid ? (
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">SSL/TLS Certificate Checker</h1>
                <p className="text-zinc-400">Verify SSL certificate installation and validity</p>
            </div>

            <div className="flex gap-4">
                <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                />
                <button
                    onClick={handleLookup}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Checking...' : 'Check SSL'}
                </button>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
                    {getStatusIcon(false)}
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="space-y-6">
                    {/* Quick Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-6 rounded-2xl border ${result.valid ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(result.valid)}
                                <h3 className="text-lg font-semibold">Certificate Status</h3>
                            </div>
                            <p className={result.valid ? 'text-green-400' : 'text-red-400'}>
                                {result.valid ? 'Valid & Trusted' : 'Invalid or Expired'}
                            </p>
                        </div>

                        <div className={`p-6 rounded-2xl border ${result.daysRemaining > 30 ? 'bg-green-500/10 border-green-500/20' : result.daysRemaining > 0 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(result.daysRemaining > 0)}
                                <h3 className="text-lg font-semibold">Expiration</h3>
                            </div>
                            <p className={result.daysRemaining > 30 ? 'text-green-400' : result.daysRemaining > 0 ? 'text-yellow-400' : 'text-red-400'}>
                                {result.daysRemaining > 0
                                    ? `${result.daysRemaining} days remaining`
                                    : 'Expired'}
                            </p>
                        </div>
                    </div>

                    {/* Certificate Details */}
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-6">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Certificate Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="text-sm text-zinc-500 mb-1">Issued To (Common Name)</div>
                                <div className="text-lg font-medium break-all">{domain}</div>
                            </div>

                            <div>
                                <div className="text-sm text-zinc-500 mb-1">Issued By</div>
                                <div className="text-lg font-medium">
                                    {typeof result.issuer === 'object'
                                        ? result.issuer.O || result.issuer.CN || 'Unknown'
                                        : result.issuer}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-zinc-500 mb-1">Valid From</div>
                                <div className="text-lg font-medium">{formatDate(result.validFrom)}</div>
                            </div>

                            <div>
                                <div className="text-sm text-zinc-500 mb-1">Valid Until</div>
                                <div className="text-lg font-medium">{formatDate(result.validTo)}</div>
                            </div>

                            {result.protocol && (
                                <div>
                                    <div className="text-sm text-zinc-500 mb-1">Protocol</div>
                                    <div className="text-lg font-medium">{result.protocol}</div>
                                </div>
                            )}

                            {result.bits && (
                                <div>
                                    <div className="text-sm text-zinc-500 mb-1">Key Size</div>
                                    <div className="text-lg font-medium">{result.bits} bits</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Issuer Details */}
                    {typeof result.issuer === 'object' && (
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            <h3 className="text-xl font-semibold mb-4">Issuer Details</h3>
                            <div className="space-y-2 font-mono text-sm">
                                {Object.entries(result.issuer).map(([key, value]) => (
                                    <div key={key} className="flex gap-2">
                                        <span className="text-zinc-500">{key}:</span>
                                        <span className="text-zinc-300">{value as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Subject Details */}
                    {result.subject && (
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            <h3 className="text-xl font-semibold mb-4">Subject Details</h3>
                            <div className="space-y-2 font-mono text-sm">
                                {Object.entries(result.subject).map(([key, value]) => (
                                    <div key={key} className="flex gap-2">
                                        <span className="text-zinc-500">{key}:</span>
                                        <span className="text-zinc-300">{value as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Verification Checklist */}
                    <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                        <h3 className="text-xl font-semibold mb-4">Verification Checklist</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(result.valid)}
                                <span>TLS Certificate is correctly installed</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusIcon(result.daysRemaining > 0)}
                                <span>TLS Certificate has not expired</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusIcon(result.daysRemaining > 30)}
                                <span>Certificate expiration is more than 30 days away</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusIcon(true)}
                                <span>Certificate name matches {domain}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Informational Section */}
            <div className="mt-12 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What is SSL Certificate Checker?</h2>
                    <p className="text-zinc-300 leading-relaxed">
                        SSL Certificate Checker is a security validation tool that verifies the SSL/TLS certificate installation on a website. It checks certificate validity, expiration dates, issuer information, and encryption strength. This helps ensure your website's HTTPS connection is secure and trusted by browsers, preventing security warnings for your visitors.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Common Use Cases</h3>
                    <ul className="space-y-2 text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Certificate Monitoring:</strong> Check SSL expiration date to avoid unexpected cert expiry</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">HTTPS Verification:</strong> Confirm SSL is properly installed after deploying a new certificate</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Security Audit:</strong> Verify certificate authority, encryption strength, and protocol version</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Troubleshooting:</strong> Diagnose browser security warnings or certificate errors</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">How to Use</h3>
                    <ol className="space-y-2 text-zinc-300">
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">1.</span>
                            <span>Enter a domain name (e.g., <code className="px-2 py-1 bg-zinc-800 rounded text-blue-400">google.com</code>)</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">2.</span>
                            <span>Click <strong className="text-white">"Check SSL"</strong> to verify the certificate</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">3.</span>
                            <span>Review certificate status, expiration date, and issuer details</span>
                        </li>
                    </ol>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">What We Check</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <span className="text-white font-medium">✓</span> <span className="text-zinc-400">Certificate validity</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <span className="text-white font-medium">✓</span> <span className="text-zinc-400">Expiration date</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <span className="text-white font-medium">✓</span> <span className="text-zinc-400">Issuer authority</span>
                        </div>
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                            <span className="text-white font-medium">✓</span> <span className="text-zinc-400">Encryption strength</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
