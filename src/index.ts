import * as spotify from './api';
import { OAuthToken, Playlist } from './structs';

const playlistContainer = document.getElementById('playlists') as HTMLDivElement;
const tracklistContainer = document.getElementById('tracklist') as HTMLDivElement;
const showcase = document.getElementById('showcase') as HTMLDivElement;
const albumArt = document.getElementById('album-art') as HTMLImageElement;
const backButton = document.getElementById('back') as HTMLAnchorElement;
const toolbar = document.getElementById('toolbar') as HTMLDivElement;
const tracklistCont = document.getElementById('tracklist-container') as HTMLDivElement;

let token: OAuthToken;
let plists: Playlist[] = [];

function clearChildren(elm: HTMLElement): void {
  while (elm.lastChild) {
    elm.removeChild(elm.lastChild);
  }
};

function onBack(this: HTMLDivElement, e: MouseEvent): void {
  tracklistCont.classList.remove('active');
  playlistContainer.classList.add('active');

  clearChildren(tracklistContainer);
};

async function onSelectTrack(this: HTMLDivElement, e: MouseEvent): Promise<void> {
  const parent = (this.parentElement as HTMLDivElement);
  const plistIdx = parseInt(parent.dataset.index as string);
  const idx = parseInt(this.dataset.index as string);

  const selected = Array.prototype.slice.call(parent.getElementsByClassName('selected'));
  for (const sel of selected) {
    sel.classList.remove('selected');
  }

  const plist = plists[plistIdx];
  const track = plist.tracks[idx];

  this.classList.add('selected');

  albumArt.src = track.song.album.images[0].url.href;
};

async function onSelectPlaylist(this: HTMLDivElement, e: MouseEvent): Promise<void> {
  const idx = parseInt(this.dataset.index as string);
  if (plists[idx].tracks.length < 1) {
    plists[idx] = await spotify.fetchTracks(token, plists[idx]);
  }
  const plist = plists[idx];

  playlistContainer.dataset.index = idx.toString();

  clearChildren(tracklistContainer);

  for (let i = 0; i < plist.tracks.length; i++) {
    const track = plist.tracks[i];
    const div = document.createElement('div');
    const name = document.createElement('span');
    const artists = document.createElement('div');

    name.innerText = track.song.name;

    div.dataset.index = i.toString();
    div.dataset.id = track.song.id;
    div.dataset.albumId = track.song.album.id;

    div.classList.add('track');
    artists.classList.add('artists');

    for (const artist of track.song.artists) {
      const elm = document.createElement('span');

      elm.innerText = artist.name;
      elm.dataset.id = artist.id;

      artists.appendChild(elm);
    }

    div.addEventListener('click', onSelectTrack);

    div.appendChild(name);
    div.appendChild(artists);

    tracklistContainer.appendChild(div);
  }

  tracklistContainer.dataset.index = idx.toString();

  playlistContainer.classList.remove('active');
  tracklistCont.classList.add('active');
};

(async () => {
  spotify.setClientID('028a849ca80149d79fbbc64135033e54');

  backButton.addEventListener('click', onBack);

  const query = new URLSearchParams(window.location.hash.substr(1));
  const at = query.get('access_token');

  if (at === null || at.length < 1) {
    window.location.href = 'https://accounts.spotify.com/authorize' +
      '?client_id=' + encodeURIComponent(spotify.getClientID() as string) +
      '&response_type=' + encodeURIComponent('token') +
      '&redirect_uri=' + encodeURIComponent('http://localhost/callback') +
      '&scope=' + encodeURIComponent('playlist-read-private');
    return;
  }

  window.location.hash = '';

  token = new OAuthToken();
  token.accessToken = decodeURIComponent(at as string);
  token.expiresAt = new Date(window.performance.timeOrigin + (parseInt(query.get('expires_in') as string) * 1000));

  clearChildren(playlistContainer);

  plists = await spotify.fetchPlaylists(token);
  console.log(plists);
  for (let i = 0; i < plists.length; i++) {
    const plist = plists[i];
    const playlist = document.createElement('div');
    const name = document.createElement('span');

    playlist.dataset.index = i.toString();
    playlist.dataset.id = plist.id;
    name.innerText = plist.name;

    playlist.classList.add('playlist');

    playlist.appendChild(name);
    playlistContainer.appendChild(playlist);

    playlist.addEventListener('click', onSelectPlaylist);
  }

  playlistContainer.classList.add('active');
})();
