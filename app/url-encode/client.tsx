'use client';

import { useState } from 'react';

export default function UrlEncodeClient() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');

    const handleProcess = () => {
        try {
            if (mode === 'encode') {
                setOutput(encodeURIComponent(input));
            } else {
                setOutput(decodeURIComponent(input));
            }
        } catch (error) {
            setOutput('Error: Invalid URL format');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold">URL Encoder / Decoder</h1>
                <p className="text-zinc-400">Encode or decode URLs safely.</p>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setMode('encode')}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${mode === 'encode'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                >
                    Encode
                </button>
                <button
                    onClick={() => setMode('decode')}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${mode === 'decode'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                >
                    Decode
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Input</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-32 p-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none font-mono text-sm"
                        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL to decode...'}
                    />
                </div>

                <button
                    onClick={handleProcess}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                    {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
                </button>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Output</label>
                    <div className="relative">
                        <textarea
                            readOnly
                            value={output}
                            className="w-full h-32 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 outline-none resize-none font-mono text-sm text-zinc-300"
                            placeholder="Result will appear here..."
                        />
                        {output && (
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-4 right-4 px-3 py-1 text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                            >
                                Copy
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Informational Section */}
            <div className="mt-12 p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">What is URL Encoder/Decoder?</h2>
                    <p className="text-zinc-300 leading-relaxed">
                        URL Encoder/Decoder safely converts special characters in URLs to percent-encoded format and vice versa. It ensures characters like spaces, symbols, and non-ASCII characters are properly formatted for web transmission. This prevents broken links and ensures URLs work correctly across all browsers and systems.
                    </p>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Common Use Cases</h3>
                    <ul className="space-y-2 text-zinc-300">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">API Development:</strong> Encode parameters before sending in HTTP requests</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Query Strings:</strong> Properly format search parameters with special characters</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Debugging:</strong> Decode URL-encoded strings to read the actual values</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span><strong className="text-white">Data Safety:</strong> Ensure URLs don't break with spaces or special symbols</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">How to Use</h3>
                    <ol className="space-y-2 text-zinc-300">
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">1.</span>
                            <span>Select <strong className="text-white">"Encode"</strong> or <strong className="text-white">"Decode"</strong> mode</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">2.</span>
                            <span>Paste your text or URL into the input field</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="text-blue-400 font-bold">3.</span>
                            <span>Click the button to process, then copy the result</span>
                        </li>
                    </ol>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-3">Examples</h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="text-sm text-zinc-500 mb-1">Original:</div>
                            <code className="text-blue-400">Hello World!</code>
                            <div className="text-sm text-zinc-500 mt-2 mb-1">Encoded:</div>
                            <code className="text-green-400">Hello%20World%21</code>
                        </div>
                        <div className="p-4 bg-zinc-800/50 rounded-lg">
                            <div className="text-sm text-zinc-500 mb-1">Original:</div>
                            <code className="text-blue-400">user@example.com</code>
                            <div className="text-sm text-zinc-500 mt-2 mb-1">Encoded:</div>
                            <code className="text-green-400">user%40example.com</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
