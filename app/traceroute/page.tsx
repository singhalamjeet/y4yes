import { Metadata } from 'next';
import TracerouteClient from './client';

export const metadata: Metadata = {
    title: 'Traceroute Tool - Trace Network Path',
    description: 'Free Traceroute tool to trace the path packets take to reach a destination. Diagnose network routing issues and latency.',
    keywords: ['traceroute', 'trace route', 'network path', 'routing issues', 'latency check', 'network diagnostics'],
};

export default function TraceroutePage() {
    return <TracerouteClient />;
}
