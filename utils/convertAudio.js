import execImport from "child_process";
const exec = execImport.execFile
import ncp from "ncp";
import path from "path";
import chmod from "chmod";
//const __dirname = path.resolve();
const convertAudio = async (input, output, codec) =>
new Promise((resolve, reject) => {
  let start = Date.now();
  /*
    We can't run the ffmpeg from the current folder because it is read only.
    in Lambda all locations except /tmp are read only.
    So I had to copy the ffmpeg to the temp folder and give it execute permissions to make it work
   */
  // ncp will copy the whole directory to /tmp/ffmpeg
  ncp(
    path.join(__dirname, "../ffmpeg-static"),
    "/tmp/ffmpeg",
    {
      clobber: false, // Do not overwrite if already exists (Lambda sometimes re-uses the container)
    },
    (err) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        // Give execute permissions to the ffmpeg
        chmod("/tmp/ffmpeg/ffmpeg", {
          execute: true,
        })

        // Muxing an audio file and a video file into one video file
        // This could be any operation on FFmpeg, you just have to give the parameters correctly.
        exec(
          "/tmp/ffmpeg/ffmpeg",
          [
            "-y",
            "-i",
            input,
            "-c:a",
            codec,
            output,
          ],
          {},
          (error, stdout) => {
            if (error) {
              reject(error)
            } else {
              resolve(stdout)
            }
          }
        )
      }
    }
  )
  return
})
export default convertAudio
  //convertAudio("./audio.m4a", "./audio.mp3", "libmp3lame")