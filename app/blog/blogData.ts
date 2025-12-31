// Blog post metadata
export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
    keywords: string[];
    author: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'how-to-find-ip-address',
        title: 'How to Find Your IP Address on Any Device (2025 Guide)',
        excerpt: 'Complete guide to finding your public and private IP address on Windows, Mac, Linux, iPhone, and Android. Includes online tools and troubleshooting tips.',
        date: '2025-12-30',
        readTime: '8 min read',
        category: 'Networking',
        keywords: ['how to find ip address', 'check ip address', 'find my ip', 'what is my ip'],
        author: 'y4yes Team'
    },
    {
        slug: 'ipv4-vs-ipv6-complete-guide',
        title: 'IPv4 vs IPv6: Complete Guide to Internet Protocols in 2025',
        excerpt: 'Understand the key differences between IPv4 and IPv6, why the transition matters, and how it affects your network. Includes migration guide for businesses.',
        date: '2025-12-29',
        readTime: '10 min read',
        category: 'Networking',
        keywords: ['ipv4 vs ipv6', 'difference between ipv4 ipv6', 'what is ipv6', 'ipv6 migration'],
        author: 'y4yes Team'
    },
    {
        slug: 'internet-speed-test-guide',
        title: 'How to Check Internet Speed: Complete Testing Guide 2025',
        excerpt: 'Learn how to accurately test your internet speed, understand Mbps and latency, and troubleshoot slow connections. Perfect for gamers and streamers.',
        date: '2025-12-28',
        readTime: '9 min read',
        category: 'Performance',
        keywords: ['internet speed test', 'check internet speed', 'how to test internet speed', 'speed test guide'],
        author: 'y4yes Team'
    },
    {
        slug: 'dns-explained-simple-guide',
        title: 'DNS Explained: How Domain Name System Works (Simple Guide)',
        excerpt: 'Simple explanation of DNS, how it works, common record types, and how to troubleshoot DNS issues. Beginner-friendly guide with examples.',
        date: '2025-12-27',
        readTime: '7 min read',
        category: 'DNS',
        keywords: ['what is dns', 'how dns works', 'dns explained', 'dns records'],
        author: 'y4yes Team'
    },
    {
        slug: 'network-troubleshooting-commands',
        title: 'Network Troubleshooting: 10 Essential Commands Everyone Should Know',
        excerpt: 'Master essential network commands like ping, traceroute, nslookup, and more. Complete guide with real-world troubleshooting examples.',
        date: '2025-12-26',
        readTime: '12 min read',
        category: 'Troubleshooting',
        keywords: ['network troubleshooting', 'network commands', 'fix internet connection', 'ping traceroute'],
        author: 'y4yes Team'
    }
];
