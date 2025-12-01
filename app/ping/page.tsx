import { Metadata } from 'next';
import PingClient from './client';

export const metadata: Metadata = {
    title: 'Ping Test - Check Website Status & Latency',
    description: 'Free Ping Test tool to check if a website or IP is up. Measure latency, packet loss, and server response time.',
    keywords: ['ping test', 'ping website', 'check server status', 'website down check', 'latency test', 'packet loss'],
};

export default function PingPage() {
    return <PingClient />;
}
