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
    resFormat = 'm4a';
    extention = format;
  }

  console.log(extention)

  const requestYTDLStream = (url) => new Promise(async (resolve, reject) => {
    const stream = ytdl(url, {
      //filter: format => format.container === container,
      // dlChunkSize: 0,
      filter: 'audioonly',
      format: resFormat,
      quality: 'lowestaudio',
    }).pipe(fs.createWriteStream(`./audio.${extention}`))
    stream.on("close", () => resolve(stream)).on("error", err => reject(err));
  });
  await requestYTDLStream(url)
  const stream = await fs.readFileSync(`./audio.${extention}`)
  const stats = await fs.statSync(`./audio.${extention}`)
  const fileSizeInBytes = stats.size;
  console.log(stream)

  return {
    statusCode: 200,
    headers: {
      "Content-Type": `audio/${extention}`,
      "Content-Length": fileSizeInBytes,
      "Content-Disposition": `attachment; filename="audio.${extention}"`,
      //    "Cache-Control": "s-maxage=2592000, max-age=86400",
    },
    body: stream.toString("base64"),
    //  body: base64.b64encode(stream),
    isBase64Encoded: true,
  };
}