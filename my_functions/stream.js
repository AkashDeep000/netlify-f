import ytdl from "ytdl-core"
import fs from "fs"
exports.handler = async function (event, context) {
  const id = event.queryStringParameters.id
  /* let stream = await ytdl(`https://www.youtube.com/watch?v=${id}`, {
    filter: "audioonly",
    dlChunkSize: 0,
  })
  .on('end', () => {
    console.log('Successfully downloaded the stream!');
  });
*/
  const url = `https://www.youtube.com/watch?v=${id}`;

  const requestYTDLStream = (url) => new Promise(async (resolve, reject) => {
    const stream = ytdl(url, {
    //  filter: 'audioonly',
    quality: "lowestaudio",
    
      dlChunkSize: 0,
    });
    stream.pipe(await fs.createWriteStream(`/tmp/audio.mp3`))
    stream.on("finish", () => resolve(stream)).on("error", err => reject(err));
  });
  await requestYTDLStream(url)
  const stream = fs.readFileSync(`/tmp/audio.mp3`)
  console.log(stream)

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "audio/mp3",
    },
    body: stream.toString("base64"),
    isBase64Encoded: true,
  };
}