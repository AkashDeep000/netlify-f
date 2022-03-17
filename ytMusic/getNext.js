import axios from "axios";
import context from './context';

export default async function getNext(){
    
//console.log("ytM start")
const response = await axios.post(
    'https://music.youtube.com/youtubei/v1/next?alt=json&key=AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30',
    {
        ...context.body,
        enablePersistentPlaylistPanel: true,
        isAudioOnly: true,
        params: "mgMDCNgE",
        playlistId: "RDAMVMMJyKN-8UncM",
        tunerSettingValue: "AUTOMIX_SETTING_NORMAL",
        videoId: "MJyKN-8UncM",
      },
      {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'origin': 'https://music.youtube.com',
        },
      }
  );
//console.log("ytM finished")
const refined = response.data.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs

const [,...contentAll] = refined[0].tabRenderer.content.musicQueueRenderer.content.playlistPanelRenderer.contents.map(el => {

const artists = el.playlistPanelVideoRenderer.longBylineText.runs.filter(el => el.navigationEndpoint ? true : false).map(el => {return el.text})

    return {
    title: el.playlistPanelVideoRenderer.title.runs[0].text,
    videoId: el.playlistPanelVideoRenderer.videoId,
    thumbnail: el.playlistPanelVideoRenderer.thumbnail.thumbnails[el.playlistPanelVideoRenderer.thumbnail.thumbnails.length-1].url,
    artists: artists
   }
  
})

const content = contentAll.filter(el => {
  return el.title.includes("|") ? false : true
})

const relatedId = refined[2].tabRenderer.endpoint.browseEndpoint.browseId


const final = {
  relatedId: relatedId,
  content: content,
}


  return final
  
}