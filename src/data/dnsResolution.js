// Single source of truth for the DNS resolution walkthrough.
//
// Models a recursive lookup of www.example.com: the stub resolver on your device
// asks a recursive resolver, which walks the DNS hierarchy (root → TLD →
// authoritative) following referrals, then returns and caches the answer.
//
// `from`/`to` reference entries in ACTORS. `direction` is 'query' (asking,
// outward) or 'answer'/'referral' (coming back). `fields` reuse the shape
// consumed by FieldDetail: { name, exampleValue, detail }.

const RECURSIVE = '#42d6a4';
const ROOT = '#ffb454';
const TLD = '#ff6b8b';
const AUTH = '#9d7bff';
const CLIENT = '#7c8cff';

// The participants, in hierarchy order — drives the journey strip.
export const ACTORS = [
  { id: 'stub', label: 'Stub Resolver', sublabel: 'Your device' },
  { id: 'recursive', label: 'Recursive Resolver', sublabel: 'e.g. 1.1.1.1' },
  { id: 'root', label: 'Root', sublabel: '. (root)' },
  { id: 'tld', label: 'TLD', sublabel: '.com' },
  { id: 'authoritative', label: 'Authoritative', sublabel: 'example.com' },
];

export const DNS_STEPS = [
  {
    id: 'stub-query',
    from: 'stub',
    to: 'recursive',
    direction: 'query',
    accentColor: RECURSIVE,
    title: 'Recursive Query',
    summary:
      "Your device's stub resolver can't do the legwork itself — it asks its configured recursive resolver to resolve www.example.com and expects a final answer back.",
    fields: [
      {
        name: 'Txn ID',
        exampleValue: '0x1a2b',
        detail:
          'A random transaction ID. The resolver matches each reply to its query by this ID, which also helps guard against spoofed responses.',
      },
      {
        name: 'QNAME',
        exampleValue: 'www.example.com',
        detail:
          'The domain name being looked up — the core question of the query.',
      },
      {
        name: 'QTYPE',
        exampleValue: 'A',
        detail:
          'The record type requested. A is an IPv4 address; other common types are AAAA (IPv6), MX (mail), and CNAME (alias).',
      },
      {
        name: 'QCLASS',
        exampleValue: 'IN',
        detail:
          'The class of the query. Essentially always IN (Internet).',
      },
      {
        name: 'RD',
        exampleValue: '1',
        detail:
          'Recursion Desired. Set to 1, it asks the recursive resolver to do the full chain of lookups on the client\'s behalf.',
      },
    ],
  },
  {
    id: 'root',
    from: 'recursive',
    to: 'root',
    direction: 'referral',
    accentColor: ROOT,
    title: 'Ask a Root Server',
    summary:
      "If the answer isn't cached, the resolver starts at the top. A root server doesn't know the address, but it knows who runs .com — so it returns a referral.",
    fields: [
      {
        name: 'AA',
        exampleValue: '0',
        detail:
          'Authoritative Answer flag is 0: this is a referral, not the final answer. The root is delegating downward.',
      },
      {
        name: 'Authority · NS',
        exampleValue: 'com. → a.gtld-servers.net',
        detail:
          'The Authority section lists the name servers responsible for the .com zone — pointing the resolver to the next tier down.',
      },
      {
        name: 'Additional · glue',
        exampleValue: 'a.gtld-servers.net → 192.5.6.30',
        detail:
          'A glue record: the IP of the referred name server, included so the resolver can contact it without a separate lookup (which would otherwise be circular).',
      },
    ],
  },
  {
    id: 'tld',
    from: 'recursive',
    to: 'tld',
    direction: 'referral',
    accentColor: TLD,
    title: 'Ask the .com TLD Server',
    summary:
      "The .com TLD servers don't hold the address either, but they know which name servers are authoritative for example.com — another referral, one step closer.",
    fields: [
      {
        name: 'AA',
        exampleValue: '0',
        detail:
          'Still a referral (Authoritative Answer = 0). The TLD delegates to the domain\'s own name servers.',
      },
      {
        name: 'Authority · NS',
        exampleValue: 'example.com → ns1.example.com',
        detail:
          'The name servers registered as authoritative for example.com — set when the domain was registered.',
      },
      {
        name: 'Additional · glue',
        exampleValue: 'ns1.example.com → 199.43.135.53',
        detail:
          'Glue for the authoritative name server, so the resolver can reach it directly.',
      },
    ],
  },
  {
    id: 'authoritative',
    from: 'recursive',
    to: 'authoritative',
    direction: 'answer',
    accentColor: AUTH,
    title: 'Ask the Authoritative Server',
    summary:
      "example.com's authoritative server actually holds the records. It returns the A record with the real IP address — and a TTL saying how long it may be cached.",
    fields: [
      {
        name: 'AA',
        exampleValue: '1',
        detail:
          'Authoritative Answer = 1: this server is the source of truth for example.com, so this is the definitive answer.',
      },
      {
        name: 'Answer · A',
        exampleValue: 'www.example.com → 93.184.216.34',
        detail:
          'The answer the whole journey was for: the A record mapping the hostname to its IPv4 address.',
      },
      {
        name: 'TTL',
        exampleValue: '300',
        detail:
          'Time To Live, in seconds. Resolvers may cache this record for up to this long before they must look it up again.',
      },
    ],
  },
  {
    id: 'answer',
    from: 'recursive',
    to: 'stub',
    direction: 'answer',
    accentColor: CLIENT,
    title: 'Return the Answer',
    summary:
      'The recursive resolver caches the result for the TTL and hands the IP back to your device. The next lookup for this name is answered instantly from cache — no walk required.',
    fields: [
      {
        name: 'Answer · A',
        exampleValue: 'www.example.com → 93.184.216.34',
        detail:
          'The final answer delivered to the stub resolver, which passes the IP to the application so it can open a connection.',
      },
      {
        name: 'TTL',
        exampleValue: '300',
        detail:
          'The remaining cache lifetime. Both the recursive resolver and your device honour it before re-querying.',
      },
      {
        name: 'RA',
        exampleValue: '1',
        detail:
          'Recursion Available — the resolver confirming it performed the recursive lookup on the client\'s behalf.',
      },
    ],
  },
];

export default DNS_STEPS;
