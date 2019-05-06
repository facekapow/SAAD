export class OAuthToken {
  public accessToken: string = '';
  public refreshToken: string | null = null;
  public expiresAt: Date = new Date();
};

export class Image {
  public height: number = 0;
  public width: number = 0;
  public url: URL = new URL('data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==');
};

export class Artist {
  public name: string = '';
  public id: string = '';
};

export class Album {
  public name: string = '';
  public artists: Artist[] = [];
  public images: Image[] = [];
  public id: string = '';
};

export class Song {
  public name: string = '';
  public artists: Artist[] = [];
  public album: Album = new Album();
  public id: string = '';
};

export class Track {
  public timestamp: Date = new Date();
  public song: Song = new Song();
};

export class Playlist {
  public name: string = '';
  public id: string = '';
  public tracks: Track[] = [];
};
