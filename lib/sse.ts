// ============================================================
// BARCOINS — Server-Sent Events (SSE)
// Usage : classement temps réel, état de la soirée en cours
// Pattern : API route → SSEStream → client React via EventSource
// ============================================================

// ─────────────────────────────────────────────
// Gestion des connexions actives (en mémoire par instance)
// En production Railway : Redis Pub/Sub si multi-instance
// ─────────────────────────────────────────────

type SSEClient = {
  barId: string;
  channel: string;
  controller: ReadableStreamDefaultController;
};

const clients = new Map<string, SSEClient[]>();

function getClientsForChannel(barId: string, channel: string): SSEClient[] {
  const key = `${barId}:${channel}`;
  return clients.get(key) ?? [];
}

function addClient(client: SSEClient): string {
  const key = `${client.barId}:${client.channel}`;
  const id = crypto.randomUUID();
  clients.set(key, [...getClientsForChannel(client.barId, client.channel), client]);
  return id;
}

function removeClient(barId: string, channel: string, controller: ReadableStreamDefaultController): void {
  const key = `${barId}:${channel}`;
  const existing = clients.get(key) ?? [];
  clients.set(key, existing.filter((c) => c.controller !== controller));
}

// ─────────────────────────────────────────────
// createSSEStream — crée un flux SSE pour une API route Next.js
// Usage :
//   return createSSEStream({ barId, channel: 'leaderboard' })
// ─────────────────────────────────────────────

export function createSSEStream(params: {
  barId: string;
  channel: string;
}): Response {
  const { barId, channel } = params;

  const stream = new ReadableStream({
    start(controller) {
      const client: SSEClient = { barId, channel, controller };
      addClient(client);

      // Envoi d'un ping initial pour confirmer la connexion
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'));

      // Nettoyage à la déconnexion
      const cleanup = () => removeClient(barId, channel, controller);
      // Le cleanup est appelé automatiquement quand le client ferme la connexion
      // (ReadableStream cancel)
      return cleanup;
    },
    cancel(controller) {
      removeClient(barId, channel, controller as unknown as ReadableStreamDefaultController);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // désactive le buffering Nginx/Railway
    },
  });
}

// ─────────────────────────────────────────────
// broadcast — envoie un événement à tous les clients d'un channel
// Usage depuis les API routes qui mettent à jour les données :
//   broadcast({ barId, channel: 'leaderboard', data: { rankings: [...] } })
// ─────────────────────────────────────────────

export function broadcast(params: {
  barId: string;
  channel: string;
  data: Record<string, unknown>;
  eventType?: string;
}): void {
  const { barId, channel, data, eventType = 'update' } = params;
  const clientList = getClientsForChannel(barId, channel);
  if (clientList.length === 0) return;

  const encoder = new TextEncoder();
  const payload = encoder.encode(
    `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`
  );

  const deadClients: SSEClient[] = [];

  for (const client of clientList) {
    try {
      client.controller.enqueue(payload);
    } catch {
      // Client déconnecté
      deadClients.push(client);
    }
  }

  // Nettoyage des clients morts
  if (deadClients.length > 0) {
    const key = `${barId}:${channel}`;
    const remaining = (clients.get(key) ?? []).filter(
      (c) => !deadClients.includes(c)
    );
    clients.set(key, remaining);
  }
}

// ─────────────────────────────────────────────
// Canaux SSE disponibles (convention de nommage)
// ─────────────────────────────────────────────

export const SSE_CHANNELS = {
  LEADERBOARD: 'leaderboard',   // classement soirée en temps réel
  GAME_STATE: 'game-state',     // état de la partie en cours (quiz/blind test)
  NOTIFICATIONS: 'notifications', // notifications push joueur
} as const;

// ─────────────────────────────────────────────
// Hook client React (usage côté 'use client')
// Exemple :
//   const { data } = useSSE(`/api/bars/${barId}/leaderboard/stream`)
// ─────────────────────────────────────────────

// Note : le hook React est dans components/hooks/useSSE.ts
// Pour rester compatible avec le Edge runtime, ce fichier ne contient
// que du code Node.js. Les hooks client sont séparés.
