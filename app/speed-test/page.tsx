import { Metadata } from 'next';
import SpeedTestClient from './client';

export const metadata: Metadata = {
    title: 'Internet Speed Test – Check Download & Upload Speed | y4yes',
    description: 'Test your download speed, upload speed, and ping latency. Free, accurate, and fast broadband speed test online.',
    keywords: ['speed test', 'internet speed test', 'download speed', 'upload speed', 'ping test', 'broadband speed'],
};

export default function SpeedTestPage() {
    return <SpeedTestClient />;
}
