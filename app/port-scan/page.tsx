import { Metadata } from 'next';
import PortScanClient from './client';

export const metadata: Metadata = {
    title: 'Free Port Scanner – Check Open Ports Online | y4yes',
    description: 'Scan common ports (21, 22, 80, 443, etc.) to identify open services. Fast, free, and secure online port scanner.',
    keywords: ['port scanner', 'open port check', 'port check', 'server security', 'network scanner', 'tcp port scan'],
};

export default function PortScanPage() {
    return <PortScanClient />;
}
