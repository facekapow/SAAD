import { Playlist, Track, Song, Album, Artist, Image, OAuthToken } from './structs';

let apiBase: string = 'https://api.spotify.com/v1';
let clientID: string | null = null;

export function setClientID(id: string): void {
  clientID = id;
};

export function getClientID(): string | null {
  return clientID;
};

export async function fetchTracks(token: OAuthToken, plist: Playlist): Promise<Playlist> {
  let next: string | null = apiBase + '/playlists/' + plist.id + '/tracks';
  while (next !== null) {
    const res = await fetch(next, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + token.accessToken,
      }),
    });
    const json = await res.json();
    for (const t of json.items) {
      const track = t.track;
      const obj = new Track();
      obj.timestamp = new Date(t.added_at);

      obj.song = new Song();
      obj.song.id = track.id;
      obj.song.name = track.name;

      obj.song.album = new Album();
      obj.song.album.id = track.album.id;
      obj.song.album.name = track.album.name;

      for (const artistData of track.artists) {
        const artist = new Artist();
        artist.name = artistData.name;
        artist.id = artistData.id;
        obj.song.artists.push(artist);
      }

      for (const artistData of track.album.artists) {
        const artist = new Artist();
        artist.name = artistData.name;
        artist.id = artistData.id;
        obj.song.album.artists.push(artist);
      }

      for (const image of track.album.images) {
        const img = new Image();
        img.height = image.height;
        img.width = image.width;
        img.url = new URL(image.url);
        obj.song.album.images.push(img);
      }

      plist.tracks.push(obj);
    }
    next = json.next;
  }
  return plist;
};

export async function fetchPlaylists(token: OAuthToken): Promise<Playlist[]> {
  let result: Playlist[] = [];
  let next: string | null = apiBase + '/me/playlists';
  while (next !== null) {
    const res = await fetch(next, {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Bearer ' + token.accessToken,
      }),
    });
    const json = await res.json();
    for (const plist of json.items) {
      const obj = new Playlist();
      obj.id = plist.id;
      obj.name = plist.name;
      result.push(obj);
    }
    next = json.next;
  }
  return result;
};
