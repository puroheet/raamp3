export interface AppFile {
  id: string;
  file: File;
  url: string;
}

export interface Metadata {
  title: string;
  artist: string;
  album: string;
  year: string;
  genre: string;
  track: string;
  composer: string;
  picture?: { 
    data: ArrayBuffer;
    format: string;
  } | null;
}
