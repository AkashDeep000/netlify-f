/*import ffmpeg from 'fluent-ffmpeg';
import pathToFfmpeg from 'ffmpeg-static';

const convertAudio = async (sourcePath, outputPath, codec) => {
  console.log('start cut video');

  await new Promise((resolve, reject) => {
    let start = Date.now();
    ffmpeg(sourcePath)
    .setFfmpegPath("./ffmpeg-static/ffmpeg")
    .audioCodec(codec)
    // .audioBitrate(128)
    .save(outputPath)
    .on('progress', p => {})
    .on('end', () => {
      console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
    });
  });
  return
};
//export default convertAudio;
convertAudio("./audio.m4a", "./audio.mp3", "libmp3lame")*/