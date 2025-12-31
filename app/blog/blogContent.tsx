import React from 'react';
import Link from 'next/link';

export const blogContent: Record<string, { content: React.ReactElement }> = {
    'how-to-find-ip-address': {
        content: (
            <>
                <p>Finding your IP address is essential for network troubleshooting, remote access setup, VPN configuration, and more. This comprehensive guide shows you exactly how to find your IP address on any device.</p>

                <h2>What is an IP Address?</h2>
                <p>An IP address (Internet Protocol address) is a unique numerical identifier assigned to your device when it connects to a network. There are two types:</p>
                <ul>
                    <li><strong>Public IP:</strong> Your external address visible to websites and services on the internet (assigned by your ISP)</li>
                    <li><strong>Private IP:</strong> Your internal address on your local network (assigned by your router)</li>
                </ul>

                <h2>Quick Method: Find IP Online</h2>
                <p>The fastest way to find your public IP address is to use an online tool. Our <Link href="/ip" className="text-blue-400 hover:text-blue-300 underline">IP Address Checker</Link> instantly shows your public IP, location, and ISP information with a single click.</p>

                <h2>How to Find IP on Windows</h2>
                <h3>Method 1: Using Settings</h3>
                <ol>
                    <li>Click Start menu →  Settings → Network & Internet</li>
                    <li>Click "Wi-Fi" or "Ethernet" (whichever you're connected to)</li>
                    <li>Click your network name</li>
                    <li>Scroll down to find "IPv4 address"</li>
                </ol>

                <h3>Method 2: Using Command Prompt</h3>
                <ol>
                    <li>Press Win + R, type "cmd", press Enter</li>
                    <li>Type <code>ipconfig</code> and press Enter</li>
                    <li>Find "IPv4 Address" under your active connection</li>
                </ol>

                <h2>How to Find IP on Mac</h2>
                <h3>Method 1: System Preferences</h3>
                <ol>
                    <li>Click Apple menu → System Preferences → Network</li>
                    <li>Select your active connection (Wi-Fi or Ethernet)</li>
                    <li>Your IP address is displayed on the right</li  >
                </ol>

                <h3>Method 2: Terminal</h3>
                <ol>
                    <li>Open Terminal (Applications → Utilities → Terminal)</li>
                    <li>Type <code>ifconfig | grep "inet "</code> and press Enter</li>
                </ol>

                <h2>How to Find IP on Linux</h2>
                <p>Open Terminal and run one of these commands:</p>
                <ul>
                    <li><code>ip addr show</code> - Shows all network interfaces</li>
                    <li><code>hostname -I</code> - Shows only IP addresses</li>
                    <li><code>ifconfig</code> - Traditional method (may need net-tools package)</li>
                </ul>

                <h2>How to Find IP on iPhone/iPad</h2>
                <ol>
                    <li>Open Settings app</li>
                    <li>Tap "Wi-Fi"</li>
                    <li>Tap the (i) info icon next to your connected network</li>
                    <li>Your IP address is listed under "IPV4 ADDRESS"</li>
                </ol>

                <h2>How to Find IP on Android</h2>
                <ol>
                    <li>Open Settings</li>
                    <li>Tap "Network & Internet" or "Connections"</li>
                    <li>Tap "Wi-Fi"</li>
                    <li>Tap your connected network</li>
                    <li>Scroll down to find "IP address"</li>
                </ol>

                <h2>Public vs Private IP: What's the Difference?</h2>
                <ul>
                    <li><strong>Public IP</strong> is your address on the internet - visible to websites you visit</li>
                    <li><strong>Private IP</strong> is your address on your local network - only visible within your home/office network</li>
                    <li>Your router uses NAT (Network Address Translation) to allow multiple devices to share one public IP</li>
                </ul>

                <h2>Common Private IP Ranges</h2>
                <ul>
                    <li>192.168.0.0 - 192.168.255.255</li>
                    <li>10.0.0.0 - 10.255.255.255</li>
                    <li>172.16.0.0 - 172.31.255.255</li>
                </ul>

                <h2>Why You Might Need Your IP Address</h2>
                <ul>
                    <li>Setting up remote desktop or VPN access</li>
                    <li>Whitelisting IP for server/firewall access</li>
                    <li>Troubleshooting network connectivity issues</li>
                    <li>Configuring port forwarding on your router</li>
                    <li>Testing VPN connection (checking if IP changed)</li>
                </ul>

                <h2>Frequently Asked Questions</h2>

                <h3>Does my IP address change?</h3>
                <p>Most home internet connections use dynamic IP addresses that change periodically. Business internet often uses static IPs that never change.</p>

                <h3>Can someone hack me with my IP address?</h3>
                <p>Knowing your IP alone is not enough to hack you. However, it can reveal your approximate location and ISP. Always use a firewall and keep software updated.</p>

                <h3>How do I hide my IP address?</h3>
                <p>Use a VPN (Virtual Private Network) to mask your real IP address. The VPN assigns you a different IP address from one of their servers.</p>

                <p className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <strong>Quick Tip:</strong> Need to find your IP quickly? Use our <Link href="/ip" className="text-blue-400 hover:text-blue-300 underline">IP Address Checker Tool</Link> to see your public IP, location, ISP, and more in seconds!
                </p>
            </>
        )
    },

    'ipv4-vs-ipv6-complete-guide': {
        content: (
            <>
                <p>Understanding the difference between IPv4 and IPv6 is crucial for network professionals and businesses planning infrastructure upgrades. This complete guide explains both protocols, their differences, and why IPv6 adoption matters.</p>

                <h2>What is IPv4?</h2>
                <p>IPv4 (Internet Protocol version 4) is the fourth version of the Internet Protocol, developed in 1981. It uses a 32-bit address scheme allowing for approximately 4.3 billion unique addresses.</p>

                <p><strong>IPv4 Address Example:</strong> 192.168.1.1</p>
                <p><strong>Address Format:</strong> Four decimal numbers (0-255) separated by periods</p>

                <h2>What is IPv6?</h2>
                <p>IPv6 (Internet Protocol version 6) is the most recent version of the Internet Protocol, designed to replace IPv4. It uses a 128-bit address scheme providing virtually unlimited addresses (340 undecillion addresses).</p>

                <p><strong>IPv6 Address Example:</strong> 2001:0db8:85a3:0000:0000:8a2e:0370:7334</p>
                <p><strong>Address Format:</strong> Eight groups of four hexadecimal digits separated by colons</p>

                <h2>Key Differences: IPv4 vs IPv6</h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-zinc-700">
                        <thead>
                            <tr className="bg-zinc-800">
                                <th className="border border-zinc-700 p-3 text-left">Feature</th>
                                <th className="border border-zinc-700 p-3 text-left">IPv4</th>
                                <th className="border border-zinc-700 p-3 text-left">IPv6</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-zinc-700 p-3">Address Size</td>
                                <td className="border border-zinc-700 p-3">32-bit</td>
                                <td className="border border-zinc-700 p-3">128-bit</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">Total Addresses</td>
                                <td className="border border-zinc-700 p-3">~4.3 billion</td>
                                <td className="border border-zinc-700 p-3">340 undecillion</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">Address Format</td>
                                <td className="border border-zinc-700 p-3">Decimal</td>
                                <td className="border border-zinc-700 p-3">Hexadecimal</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">Header Size</td>
                                <td className="border border-zinc-700 p-3">20-60 bytes</td>
                                <td className="border border-zinc-700 p-3">40 bytes (fixed)</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">Security</td>
                                <td className="border border-zinc-700 p-3">IPSec optional</td>
                                <td className="border border-zinc-700 p-3">IPSec mandatory</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2>Why IPv6 is Necessary</h2>
                <h3>1. IPv4 Address Exhaustion</h3>
                <p>With billions of devices connecting to the internet (smartphones, IoT devices, computers), we've run out of IPv4 addresses. IPv6 solves this with its virtually unlimited address space.</p>

                <h3>2. Better Performance</h3>
                <p>IPv6 has a simpler header structure, making packet processing more efficient for routers and reducing latency.</p>

                <h3>3. Enhanced Security</h3>
                <p>IPv6 was designed with security in mind. IPSec (encryption and authentication) is mandatory in IPv6, whereas it's optional in IPv4.</p>

                <h3>4. Simplified Network Configuration</h3>
                <p>IPv6 supports auto-configuration, allowing devices to automatically generate their own IP addresses without needing DHCP.</p>

                <h2>IPv6 Adoption Status</h2>
                <ul>
                    <li>All major operating systems support IPv6</li>
                    <li>Most ISPs now offer IPv6 connectivity</li>
                    <li>Major websites (Google, Facebook, Netflix) support IPv6</li>
                    <li>Current global IPv6 adoption: ~40-45% and growing</li>
                </ul>

                <h2>Migration Challenges</h2>
                <ul>
                    <li><strong>Compatibility:</strong> IPv4 and IPv6 are not directly compatible</li>
                    <li><strong>Dual Stack:</strong> Most networks run both protocols simultaneously</li>
                    <li><strong>Cost:</strong> Upgrading network infrastructure requires investment</li>
                    <li><strong>Training:</strong> IT staff need to learn IPv6 concepts and troubleshooting</li>
                </ul>

                <h2>IPv6 Address Types</h2>
                <ul>
                    <li><strong>Unicast:</strong> One-to-one communication (most common)</li>
                    <li><strong>Multicast:</strong> One-to-many communication</li>
                    <li><strong>Anycast:</strong> One-to-nearest communication</li>
                </ul>

                <h2>How to Check if You're Using IPv6</h2>
                <p>Use our <Link href="/ip" className="text-blue-400 hover:text-blue-300 underline">IP Address Tool</Link> to instantly see if you're connected via IPv4 or IPv6. The tool displays your IP type, address, and location.</p>

                <h2>Best Practices for IPv6 Migration</h2>
                <ol>
                    <li>Start with dual-stack implementation (run both IPv4 and IPv6)</li>
                    <li>Test thoroughly in a non-production environment</li>
                    <li>Update security policies for IPv6</li>
                    <li  >Train network staff on IPv6 troubleshooting</li>
                    <li>Monitor network performance during transition</li>
                </ol>

                <h2>Frequently Asked Questions</h2>

                <h3>Will IPv4 completely disappear?</h3>
                <p>No, IPv4 will coexist with IPv6 for many years. Most networks use dual-stack implementations supporting both protocols.</p>

                <h3>Is IPv6 faster than IPv4?</h3>
                <p>IPv6 can be slightly faster due to more efficient routing and packet processing, but the difference is typically negligible for end users.</p>

                <h3>Do I need IPv6 at home?</h3>
                <p>Not immediately, but IPv6 becomes more important as more services adopt it exclusively. Most modern routers and ISPs support IPv6.</p>

                <p className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <strong>Check Your IP Version:</strong> Find out if you're using IPv4 or IPv6 with our <Link href="/ip" className="text-blue-400 hover:text-blue-300 underline">free IP lookup tool</Link>!
                </p>
            </>
        )
    },

    'internet-speed-test-guide': {
        content: (
            <>
                <p>Testing your internet speed is crucial for diagnosing connection issues, verifying ISP speeds, optimizing streaming and gaming, and troubleshooting network problems. This comprehensive guide covers everything you need to know about internet speed testing.</p>

                <h2>Understanding Internet Speed Metrics</h2>
                <h3>Download Speed (Mbps)</h3>
                <p>Download speed measures how fast data flows from the internet to your device. This affects:</p>
                <ul>
                    <li>Streaming video quality (Netflix, YouTube)</li>
                    <li>Downloading files, software, and games</li>
                    <li>Loading web pages</li>
                    <li>Video calls (receiving video)</li>
                </ul>

                <h3>Upload Speed (Mbps)</h3>
                <p>Upload speed measures how fast data flows from your device to the internet. This affects:</p>
                <ul>
                    <li>Video calls (sending video)</li>
                    <li>Uploading files to cloud storage</li>
                    <li>Live streaming (Twitch,YouTube)</li>
                    <li>Sending large email attachments</li>
                </ul>

                <h3>Latency/Ping (ms)</h3>
                <p>Latency measures the delay before data transfer begins. Lower is better. Critical for:</p>
                <ul>
                    <li>Online gaming (competitive gaming needs &lt;30ms)</li>
                    <li>Video conferencing</li>
                    <li>Real-time applications</li>
                    <li>VoIP calls</li>
                </ul>

                <h3>Jitter (ms)</h3>
                <p>Jitter measures variation in ping over time. Consistent ping is better than inconsistent fast ping.</p>

                <h2>How to Test Your Internet Speed Accurately</h2>
                <p>Use our <Link href="/speed-test" className="text-blue-400 hover:text-blue-300 underline">Speed Test Tool</Link> for the most accurate results. Our tool uses Cloudflare's global infrastructure and adaptive testing for precise measurements.</p>

                <h3>Best Practices for Accurate Testing</h3>
                <ol>
                    <li><strong>Use a wired connection:</strong> Ethernet provides more accurate results than Wi-Fi</li>
                    <li><strong>Close background apps:</strong> Stop downloads, uploads, and streaming</li>
                    <li><strong>Test multiple times:</strong> Run 3-5 tests and average the results</li>
                    <li><strong>Test at different times:</strong> Morning, afternoon, evening to find patterns</li>
                    <li><strong>Disconnect other devices:</strong> Reduce network congestion</li>
                </ol>

                <h2>Recommended Speeds for Common Activities</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-zinc-700">
                        <thead>
                            <tr className="bg-zinc-800">
                                <th className="border border-zinc-700 p-3 text-left">Activity</th>
                                <th className="border border-zinc-700 p-3 text-left">Recommended Speed</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-zinc-700 p-3">Web browsing, email</td>
                                <td className="border border-zinc-700 p-3">1-5 Mbps</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">HD video streaming (1080p)</td>
                                <td className="border border-zinc-700 p-3">5-10 Mbps</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">4K video streaming</td>
                                <td className="border border-zinc-700 p-3">25+ Mbps</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">Online gaming</td>
                                <td className="border border-zinc-700 p-3">3-6 Mbps (low latency required)</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">Video conferencing (HD)</td>
                                <td className="border border-zinc-700 p-3">2-4 Mbps upload</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">Large file downloads</td>
                                <td className="border border-zinc-700 p-3">50-100+ Mbps</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2>Factors That Affect Internet Speed</h2>
                <ul>
                    <li><strong>Wi-Fi vs Ethernet:</strong> Wired connections are faster and more stable</li>
                    <li><strong>Router location:</strong> Distance and obstacles affect Wi-Fi speed</li>
                    <li><strong>Network congestion:</strong> More devices = slower speeds</li>
                    <li><strong>ISP throttling:</strong> Some ISPs limit speeds during peak hours</li>
                    <li><strong>Old equipment:</strong> Outdated routers/modems can limit speeds</li>
                    <li><strong>Background activity:</strong> Updates, backups, streaming consume bandwidth</li>
                </ul>

                <h2>How to Improve Your Internet Speed</h2>
                <ol>
                    <li>Restart your router and modem</li>
                    <li>Move router to a central location</li>
                    <li>Upgrade to Wi-Fi 6 router</li>
                    <li>Use ethernet for gaming/streaming</li>
                    <li>Update router firmware</li>
                    <li>Change Wi-Fi channel to reduce interference</li>
                    <li>Contact ISP if speeds are consistently low</li>
                    <li>Upgrade your internet plan if needed</li>
                </ol>

                <h2>When to Test Your Internet Speed</h2>
                <ul>
                    <li><strong>Regular check-ups:</strong> Once a month to ensure you're getting what you pay for</li>
                    <li><strong>Before/after router changes:</strong> Verify improvements</li>
                    <li><strong>When experiencing issues:</strong> Lag, buffering, slow downloads</li>
                    <li><strong>After ISP plan changes:</strong> Confirm new speeds</li>
                </ul>

                <h2>Frequently Asked Questions</h2>

                <h3>Why is my internet slower than advertised?</h3>
                <p>ISPs advertise "up to" speeds, which are theoretical maximums. Real-world speeds are lower due to network congestion, Wi-Fi interference, and distance from the router.</p>

                <h3>What's a good internet speed?</h3>
                <p>For most households, 100-200 Mbps download is ideal. Gamers and streamers may want 300+ Mbps. Upload speed of 10-20 Mbps is sufficient for most users.</p>

                <h3>Why does Wi-Fi speed fluctuate?</h3>
                <p>Wi-Fi is affected by interference, distance, obstacles (walls), number of connected devices, and other wireless networks nearby</p>

                <p className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <strong>Test Your Speed Now:</strong> Use our <Link href="/speed-test" className="text-blue-400 hover:text-blue-300 underline">free internet speed test</Link> to measure your download,upload, latency, and jitter in seconds!
                </p>
            </>
        )
    },

    'dns-explained-simple-guide': {
        content: (
            <>
                <p>DNS (Domain Name System) is often called the "phonebook of the internet." This guide explains how DNS works in simple terms, common DNS record types, and how to troubleshoot DNS issues.</p>

                <h2>What is DNS?</h2>
                <p>DNS translates human-friendly domain names (like google.com) into computer-friendly IP addresses (like 142.250.185.46) that computers use to communicate with each other.</p>

                <p>Without DNS, you would need to memorize IP addresses for every website you want to visit!</p>

                <h2>How DNS Works: Simple Explanation</h2>
                <ol>
                    <li>You type "google.com" into your browser</li>
                    <li>Your computer asks its DNS resolver "What's the IP address for google.com?"</li>
                    <li>The DNS resolver checks its cache (memory) first</li>
                    <li>If not cached, it queries DNS root servers, then TLD servers, then authoritative nameservers</li>
                    <li>The IP address is returned to your computer</li>
                    <li>Your browser connects to that IP address</li>
                </ol>

                <p>This entire process happens in milliseconds!</p>

                <h2>Common DNS Record Types</h2>

                <h3>A Record (Address Record)</h3>
                <p>Maps a domain name to an IPv4 address.<br />
                    <strong>Example:</strong> example.com → 93.184.216.34</p>

                <h3>AAAA Record</h3>
                <p>Maps a domain name to an IPv6 address.<br />
                    <strong>Example:</strong> example.com → 2606:2800:220:1:248:1893:25c8:1946</p>

                <h3>CNAME Record (Canonical Name)</h3>
                <p>Creates an alias for another domain.<br />
                    <strong>Example:</strong> www.example.com → example.com</p>

                <h3>MX Record (Mail Exchange)</h3>
                <p>Specifies mail servers for the domain.<br />
                    <strong>Example:</strong> mail.example.com (priority 10)</p>

                <h3>TXT Record</h3>
                <p>Stores text information, used for verification and email security (SPF, DKIM, DMARC).</p>

                <h3>NS Record (Name Server)</h3>
                <p>Specifies authoritative name servers for the domain.</p>

                <p>Use our <Link href="/dns" className="text-blue-400 hover:text-blue-300 underline">DNS Lookup Tool</Link> to view all DNS records for any domain instantly.</p>

                <h2>Common DNS Issues and Solutions</h2>

                <h3>DNS Server Not Responding</h3>
                <p><strong>Solution:</strong> Change to public DNS servers like Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1)</p>

                <h3>DNS Propagation Delay</h3>
                <p><strong>Issue:</strong> DNS changes can take 24-48 hours to propagate globally<br />
                    <strong>Solution:</strong> Be patient, flush DNS cache, or use  different DNS server</p>

                <h3>Website Not Loading</h3>
                <p><strong>Solution:</strong> Flush your DNS cache:
                    <ul>
                        <li>Windows: <code>ipconfig /flushdns</code></li>
                        <li>Mac: <code>sudo dscacheutil -flushcache</code></li>
                        <li>Linux: <code>sudo systemd-resolve --flush-caches</code></li>
                    </ul>
                </p>

                <h2>Best Public DNS Servers</h2>
                <ul>
                    <li><strong>Cloudflare:</strong> 1.1.1.1 (fastest, privacy-focused)</li>
                    <li><strong>Google:</strong> 8.8.8.8 (reliable, widely used)</li>
                    <li><strong>Quad9:</strong> 9.9.9.9 (security/malware blocking)</li>
                    <li><strong>OpenDNS:</strong> 208.67.222.222 (family filtering available)</li>
                </ul>

                <h2>DNS Security</h2>
                <h3>DNSSEC (DNS Security Extensions)</h3>
                <p>Adds cryptographic signatures to DNS records to prevent tampering and DNS spoofing attacks.</p>

                <h3>DNS over HTTPS (DoH)</h3>
                <p>Encrypts DNS queries to prevent ISP tracking and improve privacy.</p>

                <h2>Frequently Asked Questions</h2>

                <h3>What does "DNS lookup failed" mean?</h3>
                <p>It means your computer couldn't translate the domain name to an IP address. Try flushing DNS cache or changing DNS servers.</p>

                <h3>How do I change my DNS server?</h3>
                <p>Go to network settings, find your connection, and manually enter DNS server addresses (like 1.1.1.1 and 8.8.8.8).</p>

                <h3>Why is DNS important?</h3>
                <p>DNS makes the internet usable by converting easy-to-remember domain names into IP addresses that computers understand.</p>

                <p className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <strong>Check DNS Records:</strong> Use our <Link href="/dns" className="text-blue-400 hover:text-blue-300 underline">DNS Lookup Tool</Link> to view A, AAAA, MX, TXT, NS, and other records for any domain!
                </p>
            </>
        )
    },

    'network-troubleshooting-commands': {
        content: (
            <>
                <p>Master these 10 essential network commands to diagnose connection issues, test connectivity, and troubleshoot network problems like a pro. This comprehensive guide covers commands for Windows, Mac, and Linux.</p>

                <h2>1. Ping - Test Network Connectivity</h2>
                <p><strong>What it does:</strong> Tests if a host is reachable and measures round-trip time.</p>
                <p><strong>Command:</strong> <code>ping example.com</code></p>
                <p><strong>Use cases:</strong></p>
                <ul>
                    <li>Check if a website/server is online</li>
                    <li>Measure network latency</li>
                    <li>Detect packet loss</li>
                </ul>
                <p>Try our graphical <Link href="/ping" className="text-blue-400 hover:text-blue-300 underline">Ping Tool</Link> for easier testing!</p>

                <h2>2. Traceroute/Tracert - Trace Network Path</h2>
                <p><strong>What it does:</strong> Shows the path packets take to reach a destination.</p>
                <p><strong>Command:</strong></p>
                <ul>
                    <li>Windows: <code>tracert example.com</code></li>
                    <li>Mac/Linux: <code>traceroute example.com</code></li>
                </ul>
                <p><strong>Use cases:</strong></p>
                <ul>
                    <li>Identify where connection fails</li>
                    <li>Find network bottlenecks</li>
                    <li>Diagnose routing issues</li>
                </ul>

                <h2>3. Nslookup - DNS Lookup</h2>
                <p><strong>What it does:</strong> Queries DNS servers to find IP addresses for domain names.</p>
                <p><strong>Command:</strong> <code>nslookup example.com</code></p>
                <p><strong>Use cases:</strong></p>
                <ul>
                    <li>Verify DNS resolution</li>
                    <li>Check which DNS server is being used</li>
                    <li>Troubleshoot DNS issues</li>
                </ul>

                <h2>4. Ipconfig/Ifconfig - Network Configuration</h2>
                <p><strong>What it does:</strong> Displays network adapter configuration.</p>
                <p><strong>Command:</strong></p>
                <ul>
                    <li>Windows: <code>ipconfig /all</code></li>
                    <li>Mac/Linux: <code>ifconfig</code> or <code>ip addr show</code></li>
                </ul>
                <p><strong>Use cases:</strong></p>
                <ul>
                    <li>Find your IP address</li>
                    <li>Check DNS servers in use</li>
                    <li>View network adapter details</li>
                </ul>

                <h2>5. Netstat - Network Statistics</h2>
                <p><strong>What it does:</strong> Shows active network connections and listening ports.</p>
                <p><strong>Command:</strong> <code>netstat -an</code></p>
                <p><strong>Use cases:</strong></p>
                <ul>
                    <li>See all active connections</li>
                    <li>Check which ports are open</li>
                    <li>Identify suspicious connections</li>
                </ul>

                <h2>6. Curl - Test HTTP/HTTPS Requests</h2>
                <p><strong>What it does:</strong> Makes HTTP requests from command line.</p>
                <p><strong>Command:</strong> <code>curl -I https://example.com</code></p>
                <p><strong>Use cases:</strong></p>
                <ul>
                    <li>Test website response</li>
                    <li>Check HTTP headers</li>
                    <li>Debug API issues</li>
                </ul>

                <h2>7. Dig - Advanced DNS Lookup</h2>
                <p><strong>What it does:</strong> Detailed DNS query tool (Mac/Linux).</p>
                <p><strong>Command:</strong> <code>dig example.com</code></p>
                <p><strong>Use cases:</strong></p>
                <ul>
                    <li>Get detailed DNS information</li>
                    <li>Query specific record types</li>
                    <li>Troubleshoot DNS propagation</li>
                </ul>

                <h2>8. Route - View Routing Table</h2>
                <p><strong>What it does:</strong> Displays and modifies network routing table.</p>
                <p><strong>Command:</strong></p>
                <ul>
                    <li>Windows: <code>route print</code></li>
                    <li>Mac/Linux: <code>route -n</code></li>
                </ul>

                <h2>9. Arp - View ARP Cache</h2>
                <p><strong>What it does:</strong> Shows IP-to-MAC address mappings.</p>
                <p><strong>Command:</strong> <code>arp -a</code></p>
                <p><strong>Use cases:</strong></p>
                <ul>
                    <li>See devices on local network</li>
                    <li>Troubleshoot local network issues</li>
                </ul>

                <h2>10. Pathping - Combined Ping and Traceroute</h2>
                <p><strong>What it does:</strong> Combines ping and traceroute with statistics (Windows).</p>
                <p><strong>Command:</strong> <code>pathping example.com</code></p>
                <p><strong>Use cases:</strong></p>
                <ul>
                    <li>Detailed route analysis</li>
                    <li>Find packet loss at each hop</li>
                </ul>

                <h2>Common Troubleshooting Workflows</h2>

                <h3>Website Won't Load</h3>
                <ol>
                    <li>Run <code>ping example.com</code> - Check if site is reachable</li>
                    <li>Run <code>nslookup example.com</code> - Verify DNS works</li>
                    <li>Try <code>ping 8.8.8.8</code> - Test if internet works at all</li>
                    <li>Flush DNS cache</li>
                </ol>

                <h3>Slow Internet Connection</h3>
                <ol>
                    <li>Run <Link href="/speed-test" className="text-blue-400 hover:text-blue-300 underline">speed test</Link> - Measure current speeds</li>
                    <li>Run <code>ping -t gateway_ip</code> - Check local network latency</li>
                    <li>Run <code>traceroute example.com</code> - Find where delay occurs</li>
                    <li>Check <code>netstat -an</code> - See if something is using bandwidth</li>
                </ol>

                <h3>Can't Connect to Specific Website</h3>
                <ol>
                    <li>Ping the domain - Is it responding?</li>
                    <li>Nslookup the domain - Is DNS working?</li>
                    <li>Try different DNS server (1.1.1.1)</li>
                    <li>Flush DNS cache and browser cache</li>
                </ol>

                <h2>Quick Reference Table</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-zinc-700">
                        <thead>
                            <tr className="bg-zinc-800">
                                <th className="border border-zinc-700 p-3 text-left">Command</th>
                                <th className="border border-zinc-700 p-3 text-left">Purpose</th>
                                <th className="border border-zinc-700 p-3 text-left">When to Use</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-zinc-700 p-3">ping</td>
                                <td className="border border-zinc-700 p-3">Test connectivity</td>
                                <td className="border border-zinc-700 p-3">Website not loading</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">traceroute</td>
                                <td className="border border-zinc-700 p-3">Find network path</td>
                                <td className="border border-zinc-700 p-3">Find where connection fails</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">nslookup</td>
                                <td className="border border-zinc-700 p-3">DNS lookup</td>
                                <td className="border border-zinc-700 p-3">DNS problems</td>
                            </tr>
                            <tr>
                                <td className="border border-zinc-700 p-3">ipconfig</td>
                                <td className="border border-zinc-700 p-3">Network info</td>
                                <td className="border border-zinc-700 p-3">Check IP/DNS settings</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <strong>Prefer GUI Tools?</strong> Use our web-based <Link href="/ping" className="text-blue-400 hover:text-blue-300 underline">Ping</Link>, <Link href="/dns" className="text-blue-400 hover:text-blue-300 underline">DNS Lookup</Link>, and <Link href="/speed-test" className="text-blue-400 hover:text-blue-300 underline">Speed Test</Link> tools - no command line needed!
                </p>
            </>
        )
    }
};
