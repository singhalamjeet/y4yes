import { Metadata } from 'next';
import SpeedTestClient from './client';

export const metadata: Metadata = {
    title: 'Internet Speed Test - Check Download & Upload Speed',
    description: 'Free Internet Speed Test tool. Test your download speed, upload speed, and ping latency. Accurate and fast broadband speed test.',
    keywords: ['speed test', 'internet speed test', 'download speed', 'upload speed', 'ping test', 'broadband speed'],
};

export default function SpeedTestPage() {
    return <SpeedTestClient />;
}
