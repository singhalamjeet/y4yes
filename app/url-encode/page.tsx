import { Metadata } from 'next';
import UrlEncodeClient from './client';

export const metadata: Metadata = {
    title: 'URL Encoder / Decoder - Online URL Tools',
    description: 'Free URL Encoder and Decoder tool. Safely encode special characters for URLs or decode encoded URLs back to text.',
    keywords: ['url encoder', 'url decoder', 'percent encoding', 'url escape', 'online url tools', 'string encoder'],
};

export default function UrlEncodePage() {
    return <UrlEncodeClient />;
}
