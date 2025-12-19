import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://y4yes.com';

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/faq',
        '/blog',
        '/supertool',
        '/speed-test',
        '/whois',
        '/ping',
        '/dns',
        '/port-scan',
        '/ssl-check',
        '/traceroute',
        '/url-encode',
        '/ip',
        '/sitemap-page',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Blog posts - in a real app, fetch these from CMS/DB
    const posts = [
        'understanding-dns-records',
        'ipv4-vs-ipv6',
        'how-ssl-works',
    ].map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...routes, ...posts];
}
