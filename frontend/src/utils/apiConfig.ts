/**
 * Kavach AI - Dynamic Backend & WebSocket Endpoint Resolver
 * Automatically adapts when accessed from localhost, local network IP (mobile phone testing),
 * or a deployed public domain / tunnel.
 */

export const getBackendBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    // If running frontend on port 3000, backend is typically on 8000 on the same machine/host
    return `${protocol}//${hostname}:8000`;
  }
  return 'http://127.0.0.1:8000';
};

export const getWebSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL;
  }
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    const wsProto = protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProto}//${hostname}:8000/ws/stream`;
  }
  return 'ws://127.0.0.1:8000/ws/stream';
};
