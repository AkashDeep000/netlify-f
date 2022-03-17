import axios from "axios";
import context from './context.js';
import {
  musicCardDecoder
} from './parser.js';

export default async function getSearch(options) {
  const {
    searchTerm,
    searchFilter,
    searchCountry,
    getOnly,
  } = options;
  let getOnlyFor
  if (getOnly) {
    getOnlyFor = getOnly;
  } else {
    getOnlyFor = ['Top result',
      'Songs',
      'Albums'];
  }
  if (searchCountry) {
    context.body.context.client.gl = searchCountry;
  }
  const reqBody = {
    ...context.body,
    query: searchTerm,
  }
  if (searchFilter) {
    switch (searchFilter) {
    case 'album':
      reqBody.params = "EgWKAQIYAWoKEAMQBBAFEAkQCg%3D%3D"
      break;
    case 'song':
      reqBody.params = "EgWKAQIIAWoKEAMQBBAFEAkQCg%3D%3D"
      break;
    case 'video':
      reqBody.params = "EgWKAQIgAWoKEAMQBBAFEAkQCg%3D%3D"
      break;
    default:
      return;
    }
  }

  //console.log("ytM start")
  const response = await axios.post(
    'https://music.youtube.com/youtubei/v1/search?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
    reqBody,
    {
      headers: {
        'User-Agent':
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'origin': 'https://music.youtube.com',
      },
    }
  );
  console.log("ytM finished")

  const sectionListRenderer = response.data.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents;

  const resultFinal = {};

  for (var i = 0; i < sectionListRenderer.length; i++) {
    if (sectionListRenderer[i].musicShelfRenderer) {
      const musicShelfRendererType = sectionListRenderer[i].musicShelfRenderer.title.runs[0].text
      // console.log(musicShelfRendererType)

      if (getOnlyFor.includes(musicShelfRendererType)) {
        let currentMusicShelfRendererType;
        console.log(musicShelfRendererType)
        switch (musicShelfRendererType) {
        case 'Top result':
          currentMusicShelfRendererType = "top"
          resultFinal.top = [];
          break;

        case 'Songs':

          currentMusicShelfRendererType = "song"
          resultFinal.song = [];
          break;
        case 'Albums':
          currentMusicShelfRendererType = "album"
          resultFinal.album = [];
          break;

        default:
          return;
        }
        //  const itemNo = (resultFinal.length - 1);
        for (const e of sectionListRenderer[i].musicShelfRenderer.contents) {
          const itemInfo = await musicCardDecoder(e)

          if (itemInfo !== undefined & itemInfo?.artist[0] !== "Instrumental") {
            resultFinal[currentMusicShelfRendererType].push(itemInfo)
          }
          /*
if (musicShelfRendererType !== "Albums" & itemInfo.artist[0] !== "Instrumental") {
}
*/

          /*
        switch (musicShelfRendererType) {
        case 'Top result':
          resultFinal.top = result;
          break;

        case 'Songs':

          resultFinal.song = result;

          break;
        case 'Albums':

          resultFinal.album = result;
          break;

        default:
          return;
        }*/

        }

      }

    }

  }
  // console.log(resultFinal)
  return resultFinal;
}