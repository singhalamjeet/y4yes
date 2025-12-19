import { Metadata } from 'next';
import PingClient from './client';

export const metadata: Metadata = {
    title: 'Ping Test Tool – Check Server Response Time | y4yes',
    description: 'Test server reachability and measure response times with our free ping tool. Live command-line output.',
    keywords: ['ping test', 'ping website', 'check server status', 'website down check', 'latency test', 'packet loss'],
};

export default function PingPage() {
    return <PingClient />;
}
