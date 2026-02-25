import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { AppFile, Metadata } from '../types';

let ffmpeg: FFmpeg | null;

export const loadFFmpeg = async () => {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  }
  return ffmpeg;
};

export const convertFile = async (
  ffmpeg: FFmpeg,
  file: AppFile,
  metadata: Metadata,
  onProgress: (progress: number) => void
): Promise<Blob> => {
  ffmpeg.on('progress', ({ progress }) => {
    onProgress(Math.round(progress * 100));
  });

  const inputFile = await fetchFile(file.file);
  await ffmpeg.writeFile('input.wav', inputFile);

  const metadataArgs = [
    '-metadata', `title=${metadata.title}`,
    '-metadata', `artist=${metadata.artist}`,
    '-metadata', `album=${metadata.album}`,
    '-metadata', `date=${metadata.year}`,
    '-metadata', `genre=${metadata.genre}`,
    '-metadata', `track=${metadata.track}`,
    '-metadata', `composer=${metadata.composer}`,
  ];

  const execArgs = ['-i', 'input.wav'];

  if (metadata.picture?.data) {
    const pictureFile = new Uint8Array(metadata.picture.data);
    await ffmpeg.writeFile('cover.jpg', pictureFile);
    execArgs.push('-i', 'cover.jpg', '-map', '0:a', '-map', '1:0', '-c:a', 'libmp3lame');
    metadataArgs.push('-metadata:s:v', 'title="Album cover"', '-metadata:s:v', 'comment="Cover (front)"');
  }

  execArgs.push(...metadataArgs, '-b:a', '320k', 'output.mp3');

  await ffmpeg.exec(execArgs);

  const data = await ffmpeg.readFile('output.mp3');
  return new Blob([data], { type: 'audio/mp3' });
};
