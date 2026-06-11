// Single source of truth for the TLS 1.3 (1-RTT) handshake walkthrough.
//
// Each entry is one message (or message group) exchanged between the client and
// the server, in order. `from` drives which lane it starts in and which way it
// travels. `secured: true` marks messages that are already encrypted (in TLS 1.3
// everything after ServerHello is protected). `fields` reuse the shape consumed
// by FieldDetail: { name, exampleValue, detail }.

const CLIENT = '#7c8cff';
const SERVER = '#42d6a4';
const APP = '#ffb454';

export const TLS_STEPS = [
  {
    id: 'client-hello',
    from: 'client',
    title: 'ClientHello',
    label: 'ClientHello',
    accentColor: CLIENT,
    secured: false,
    summary:
      'The client opens the handshake. Crucially for TLS 1.3, it already guesses a key-exchange group and sends its public key — that is what makes the handshake 1-RTT.',
    fields: [
      {
        name: 'random',
        exampleValue: '32 bytes',
        detail:
          'A fresh 32-byte random value from the client. It is mixed into key derivation so every session produces unique keys.',
      },
      {
        name: 'supported_versions',
        exampleValue: 'TLS 1.3',
        detail:
          'How a client signals TLS 1.3. The legacy version field still says 1.2 for compatibility with old middleboxes; this extension is the real version negotiation.',
      },
      {
        name: 'cipher_suites',
        exampleValue: 'TLS_AES_128_GCM_SHA256, …',
        detail:
          'The AEAD cipher + hash combinations the client supports. TLS 1.3 suites only name the symmetric cipher and hash — key exchange and signatures are negotiated separately.',
      },
      {
        name: 'supported_groups',
        exampleValue: 'x25519, secp256r1',
        detail:
          'The elliptic-curve / finite-field groups the client can use for the ephemeral Diffie-Hellman key exchange.',
      },
      {
        name: 'key_share',
        exampleValue: 'x25519 public key',
        detail:
          'The client\'s ephemeral ECDHE public key for its preferred group. Sending it up front lets the server compute the shared secret immediately — no extra round trip.',
      },
      {
        name: 'signature_algorithms',
        exampleValue: 'ecdsa_secp256r1_sha256, …',
        detail:
          'Which signature schemes the client will accept when verifying the server\'s certificate and CertificateVerify.',
      },
      {
        name: 'server_name (SNI)',
        exampleValue: 'example.com',
        detail:
          'The hostname the client is trying to reach, so a server hosting many sites can present the correct certificate.',
      },
    ],
  },
  {
    id: 'server-hello',
    from: 'server',
    title: 'ServerHello',
    label: 'ServerHello',
    accentColor: SERVER,
    secured: false,
    summary:
      'The server picks the parameters and sends its own key_share. Both sides now share an ECDHE secret — from here on, every handshake message is encrypted.',
    fields: [
      {
        name: 'random',
        exampleValue: '32 bytes',
        detail:
          'The server\'s 32-byte random value, also fed into key derivation.',
      },
      {
        name: 'cipher_suite',
        exampleValue: 'TLS_AES_128_GCM_SHA256',
        detail:
          'The single cipher suite the server selected from the client\'s list.',
      },
      {
        name: 'key_share',
        exampleValue: 'x25519 public key',
        detail:
          'The server\'s ephemeral ECDHE public key. Combined with the client\'s key_share it yields the shared secret both sides use to derive handshake and application keys.',
      },
      {
        name: 'supported_versions',
        exampleValue: 'TLS 1.3',
        detail:
          'Confirms the negotiated protocol version is TLS 1.3.',
      },
    ],
  },
  {
    id: 'encrypted-extensions',
    from: 'server',
    title: 'EncryptedExtensions',
    label: 'EncryptedExtensions',
    accentColor: SERVER,
    secured: true,
    summary:
      'The first encrypted message. It carries the remaining negotiated parameters that are not needed to establish keys — now safely hidden from eavesdroppers.',
    fields: [
      {
        name: 'ALPN',
        exampleValue: 'h2',
        detail:
          'Application-Layer Protocol Negotiation — the agreed application protocol (e.g. HTTP/2). Encrypting it in TLS 1.3 stops on-path observers from seeing which protocol you use.',
      },
      {
        name: 'extensions',
        exampleValue: 'server-side params',
        detail:
          'Any other negotiated extensions that do not affect the key schedule, such as max record size.',
      },
    ],
  },
  {
    id: 'certificate',
    from: 'server',
    title: 'Certificate',
    label: 'Certificate',
    accentColor: SERVER,
    secured: true,
    summary:
      'The server proves who it is by sending its certificate chain — encrypted, so the server\'s identity is not exposed on the wire.',
    fields: [
      {
        name: 'certificate_list',
        exampleValue: 'leaf + intermediates',
        detail:
          'The server\'s X.509 certificate followed by any intermediate CA certificates, letting the client build a chain up to a trusted root.',
      },
      {
        name: 'extensions',
        exampleValue: 'OCSP staple, SCT',
        detail:
          'Per-certificate extensions such as a stapled OCSP response (revocation status) or Signed Certificate Timestamps for Certificate Transparency.',
      },
    ],
  },
  {
    id: 'certificate-verify',
    from: 'server',
    title: 'CertificateVerify',
    label: 'CertificateVerify',
    accentColor: SERVER,
    secured: true,
    summary:
      'The server signs a hash of the whole handshake so far with its certificate\'s private key — proving it actually owns the certificate it just sent.',
    fields: [
      {
        name: 'algorithm',
        exampleValue: 'ecdsa_secp256r1_sha256',
        detail:
          'The signature scheme used, chosen from the client\'s signature_algorithms list.',
      },
      {
        name: 'signature',
        exampleValue: 'sign(transcript hash)',
        detail:
          'A signature over the transcript of every handshake message so far, made with the private key for the leaf certificate. Only the legitimate key holder can produce it, defeating impersonation.',
      },
    ],
  },
  {
    id: 'server-finished',
    from: 'server',
    title: 'Finished (server)',
    label: 'Finished',
    accentColor: SERVER,
    secured: true,
    summary:
      'A MAC over the entire handshake transcript. It confirms the keys match and that nothing was tampered with. After this the server can already send data.',
    fields: [
      {
        name: 'verify_data',
        exampleValue: 'HMAC(transcript)',
        detail:
          'An HMAC over the handshake transcript using a key derived from the shared secret. Verifying it proves both sides computed identical keys and the handshake was not modified in flight.',
      },
    ],
  },
  {
    id: 'client-finished',
    from: 'client',
    title: 'Finished (client)',
    label: 'Finished',
    accentColor: CLIENT,
    secured: true,
    summary:
      'The client verifies the server\'s certificate and Finished, then sends its own Finished. The handshake is complete and both sides switch to application traffic keys.',
    fields: [
      {
        name: 'verify_data',
        exampleValue: 'HMAC(transcript)',
        detail:
          'The client\'s HMAC over the transcript, confirming to the server that the client derived the same keys and saw the same handshake.',
      },
    ],
  },
  {
    id: 'application-data',
    from: 'client',
    title: 'Application Data',
    label: 'Application Data',
    accentColor: APP,
    secured: true,
    summary:
      'The tunnel is open. Real data (such as an HTTP request) now flows in both directions, encrypted under the application traffic keys derived during the handshake.',
    fields: [
      {
        name: 'encrypted payload',
        exampleValue: 'AEAD( GET / HTTP/2 )',
        detail:
          'Application bytes sealed with the negotiated AEAD cipher and the application traffic keys. Each record is individually authenticated, so tampering is detected.',
      },
    ],
  },
];

export default TLS_STEPS;
