import ytdl from "ytdl-core"
import fs from "fs"
exports.handler = async function (event, context) {
  const id = event.queryStringParameters.id;
  const format = event.queryStringParameters.format;
  // const quality = event.queryStringParameters.quality;
  const url = `https://www.youtube.com/watch?v=${id}`;
  
  let resFormat = "mp3";
  let extention = "mp3";
  if (format === "m4a" || "m4r") {
    resFormat = 'm4a';
    extention = format;
  } else if (format === "mp3") {
    resFormat = 'mp3';
      extention = format;
  }
  
console.log(extention)
  const requestYTDLStream = (url) => new Promise(async (resolve, reject) => {
    const stream = ytdl(url, {
      //filter: format => format.container === container,
      quality: 'lowestaudio',
      // dlChunkSize: 0,
      filter: 'audioonly',
      format: resFormat,
    });
    stream.pipe(await fs.createWriteStream(`/tmp/audio.${extention}`))
    stream.on("finish", () => resolve(stream)).on("error", err => reject(err));
  });
  await requestYTDLStream(url)
  const stream = fs.readFileSync(`/tmp/audio.${extention}`)
  console.log(stream)

  return {
    statusCode: 200,
    headers: {
      "Content-Type": `audio/${extention}`,
      "Content-Disposition": `attachment; filename="audio.${extention}"`,
     "Cache-Control": "s-maxage=2592000, max-age=86400",
    },
    body: stream.toString("base64"),
    isBase64Encoded: true,
  };
}