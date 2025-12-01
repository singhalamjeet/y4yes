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
        </div>
    );
}
