'use client';
// ============================================================
// BARCOINS — Hook React useSSE
// Gère la connexion EventSource et le state des données en temps réel
// Usage : const { data, connected } = useSSE<LeaderboardData>('/api/bars/xxx/leaderboard/stream')
// ============================================================

import { useEffect, useRef, useState } from 'react';

interface UseSSEOptions {
  onError?: (err: Event) => void;
  enabled?: boolean; // permet de désactiver sans démonter
}

interface UseSSEResult<T> {
  data: T | null;
  connected: boolean;
  error: boolean;
}

export function useSSE<T = Record<string, unknown>>(
  url: string,
  options: UseSSEOptions = {}
): UseSSEResult<T> {
  const { onError, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setError(false);
    };

    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data) as T;
        if ((parsed as Record<string, unknown>).type !== 'connected') {
          setData(parsed);
        }
      } catch {
        // ignore parse errors
      }
    };

    es.addEventListener('update', (event: MessageEvent) => {
      try {
        setData(JSON.parse(event.data) as T);
      } catch {
        // ignore
      }
    });

    es.onerror = (err) => {
      setConnected(false);
      setError(true);
      onError?.(err);
      // Reconnexion automatique gérée par le navigateur
    };

    return () => {
      es.close();
      esRef.current = null;
      setConnected(false);
    };
  }, [url, enabled]);

  return { data, connected, error };
}
