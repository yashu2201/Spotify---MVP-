import { loadEnv } from "./load-env";

loadEnv();

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifySearchResponse {
  tracks?: {
    items?: Array<{
      name: string;
      artists: Array<{ name: string }>;
      album: {
        name: string;
        images: Array<{ url: string; width: number; height: number }>;
      };
    }>;
  };
}

async function getSpotifyAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Spotify token request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as SpotifyTokenResponse;
  return data.access_token;
}

async function searchTrack(accessToken: string, query: string) {
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: "1",
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Spotify search failed (${response.status}): ${body}`);
  }

  return (await response.json()) as SpotifySearchResponse;
}

async function main() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "FAIL: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are not set. Copy .env.example to .env.local and add your credentials.",
    );
    process.exit(1);
  }

  console.log("Validating Spotify metadata API (Client Credentials)...");

  try {
    const start = Date.now();
    const accessToken = await getSpotifyAccessToken(clientId, clientSecret);
    const searchResult = await searchTrack(accessToken, "Lomelda Sunshine");
    const track = searchResult.tracks?.items?.[0];
    const latencyMs = Date.now() - start;

    if (!track) {
      console.error("FAIL: Spotify search returned no tracks for 'Lomelda Sunshine'");
      process.exit(1);
    }

    const albumArtUrl = track.album.images[0]?.url;

    console.log("PASS: Spotify token fetch and track search succeeded");
    console.log(`  Latency: ${latencyMs}ms`);
    console.log(`  Track: ${track.name} by ${track.artists[0]?.name}`);
    console.log(`  Album: ${track.album.name}`);

    if (albumArtUrl) {
      console.log(`  Album art: ${albumArtUrl}`);
    } else {
      console.warn("  WARN: No album art URL returned");
    }
  } catch (error) {
    console.error("FAIL:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
