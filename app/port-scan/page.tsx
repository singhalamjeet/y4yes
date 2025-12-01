import { Metadata } from 'next';
import PortScanClient from './client';

export const metadata: Metadata = {
    title: 'Port Scanner - Check Open Ports Online',
    description: 'Free Port Scanner tool to check for open ports on your server or IP. Scan common ports like 80 (HTTP), 443 (HTTPS), 22 (SSH), and more.',
    keywords: ['port scanner', 'open port check', 'port check', 'server security', 'network scanner', 'tcp port scan'],
};

export default function PortScanPage() {
    return <PortScanClient />;
}
