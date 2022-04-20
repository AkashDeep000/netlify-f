import ytdl from "ytdl-core"
import fs from "fs"

import convertAudio from "../utils/convertAudio.js"

exports.handler = async function (event, context) {
  const id = event.queryStringParameters.id;
  const format = event.queryStringParameters.format;
  // const quality = event.queryStringParameters.quality;
  const url = `https://www.youtube.com/watch?v=${id}`;




  const requestYTDLStream = (url) => new Promise(async (resolve, reject) => {
    const stream = ytdl(url, {
      //filter: format => format.container === container,
      // dlChunkSize: 0,
      filter: 'audioonly',
      //format: resFormat,
      quality: 'lowestaudio',
    }).pipe(fs.createWriteStream(`/tmp/audio.m4a`))

    stream.on("close", () => resolve(stream)).on("error", err => reject(err));
  });
  await requestYTDLStream(url)
  let start = Date.now();
  await convertAudio("/tmp/audio.m4a", "/tmp/audio.mp3", "libmp3lame")
  console.log(`convert successfull in ${(Date.now() - start) / 1000}s`)
  const stream = await fs.readFileSync(`/tmp/audio.mp3`)
  const stats = await fs.statSync(`/tmp/audio.mp3`)
  const fileSizeInBytes = stats.size;
  console.log(stream)

  return {
    statusCode: 200,
    headers: {
      "Content-Type": `audio/mp3`,
      "Content-Length": fileSizeInBytes,
      "Content-Disposition": `attachment; filename="audio.mp3"`,
      //    "Cache-Control": "s-maxage=2592000, max-age=86400",
    },
    body: stream.toString("base64"),
    //  body: base64.b64encode(stream),
    isBase64Encoded: true,
  };
}