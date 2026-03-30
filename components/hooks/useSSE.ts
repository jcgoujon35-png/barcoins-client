'use client';

// ============================================================
// BARCOINS — Hook React pour consommer un flux SSE
// Usage : const { data, connected } = useSSE<LeaderboardData>('/api/bars/x/leaderboard/stream')
// ============================================================

import { useEffect, useRef, useState } from 'react';

interface UseSSEOptions {
  enabled?: boolean;           // false = ne se connecte pas (utile pour désactiver conditionnellement)
  reconnectDelay?: number;     // ms entre deux tentatives (défaut: 3000)
  maxReconnects?: number;      // nombre max de reconnexions (défaut: 10)
}

interface UseSSEResult<T> {
  data: T | null;
  connected: boolean;
  error: string | null;
  lastEventType: string | null;
}

export function useSSE<T = Record<string, unknown>>(
  url: string,
  options: UseSSEOptions = {}
): UseSSEResult<T> {
  const { enabled = true, reconnectDelay = 3000, maxReconnects = 10 } = options;

  const [data, setData] = useState<T | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastEventType, setLastEventType] = useState<string | null>(null);

  const reconnectCount = useRef(0);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) return;

    function connect() {
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        setError(null);
        reconnectCount.current = 0;
      };

      // Événement générique (data: ...)
      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setData(parsed as T);
          setLastEventType('message');
        } catch {
          // message non-JSON ignoré
        }
      };

      // Événements nommés (event: update\ndata: ...)
      es.addEventListener('update', (event: MessageEvent) => {
        try {
          setData(JSON.parse(event.data) as T);
          setLastEventType('update');
        } catch {
          // ignoré
        }
      });

      es.onerror = () => {
        setConnected(false);
        es.close();

        if (reconnectCount.current < maxReconnects) {
          reconnectCount.current++;
          setTimeout(connect, reconnectDelay);
        } else {
          setError('Connexion temps réel perdue. Rechargez la page.');
        }
      };
    }

    connect();

    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, [url, enabled, reconnectDelay, maxReconnects]);

  return { data, connected, error, lastEventType };
}
