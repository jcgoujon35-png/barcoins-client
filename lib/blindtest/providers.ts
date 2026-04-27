// Blind test — intégration audio Spotify & Deezer
// RÈGLE : extraits 30s uniquement, droits gérés par le provider, 0 stockage BarCoins

export type AudioProvider = 'spotify' | 'deezer'

export interface TrackPreview {
  provider: AudioProvider
  trackId: string
  previewUrl: string
  title: string
  artist: string
}

// Spotify — preview_url dans Track object (30s, CDN p.scdn.co)
// GET https://api.spotify.com/v1/tracks/{id} avec Bearer token
export async function getSpotifyPreview(
  trackId: string,
  accessToken: string
): Promise<TrackPreview> {
  const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`)
  const track = await res.json()
  if (!track.preview_url) throw new Error('Aucun extrait disponible pour ce titre')
  return {
    provider: 'spotify',
    trackId,
    previewUrl: track.preview_url,
    title: track.name,
    artist: track.artists?.[0]?.name ?? '',
  }
}

// Deezer — champ preview dans Track object (30s, CDN e-cdns.dzcdn.net)
// GET https://api.deezer.com/track/{id} — pas d'auth pour les previews publics
export async function getDeezerPreview(trackId: string): Promise<TrackPreview> {
  const res = await fetch(`https://api.deezer.com/track/${trackId}`)
  if (!res.ok) throw new Error(`Deezer API error: ${res.status}`)
  const track = await res.json()
  if (!track.preview) throw new Error('Aucun extrait disponible pour ce titre')
  return {
    provider: 'deezer',
    trackId,
    previewUrl: track.preview,
    title: track.title,
    artist: track.artist?.name ?? '',
  }
}

// Résolution unifiée — pas de fallback cross-provider (droits non portables entre plateformes)
export async function resolvePreview(
  provider: AudioProvider,
  trackId: string,
  spotifyAccessToken?: string
): Promise<TrackPreview> {
  if (provider === 'spotify') {
    if (!spotifyAccessToken) throw new Error('Spotify access token requis')
    return getSpotifyPreview(trackId, spotifyAccessToken)
  }
  return getDeezerPreview(trackId)
}
