export const musicCardDecoder = async (input) => {


  let result = {};
  const flexColumns = await input.musicResponsiveListItemRenderer.flexColumns;
  //set title
  result.title = await flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
  // set thumbnail
  result.thumbnail = await input.musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url;
  //set watch endpoint
  const playNavigationEndpoint = await input.musicResponsiveListItemRenderer.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint;

  //set artist and type
  const textRunner = await flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs;
  // getting type of item
  const type = textRunner[0].text;

  for (let i = 1; i < textRunner.length; i++) {
    switch (type) {
      case 'Video':
        result.type = type;
        result.id = playNavigationEndpoint.watchEndpoint?.videoId;
        result.playlistId = playNavigationEndpoint.watchEndpoint?.playlistId;
        if (i < (textRunner.length - 4) & ((i % 2) === 0)) {
          if (!result.artist) {
            result.artist = []
          }
          result.artist.push(textRunner[i].text)
        }
        break;
      case 'Song':
        result.type = type;
        result.id = playNavigationEndpoint.watchEndpoint?.videoId;
        result.playlistId = playNavigationEndpoint.watchEndpoint?.playlistId;
        if (i < (textRunner.length - 4) & ((i % 2) === 0)) {
          if (!result.artist) {
            result.artist = []
          }

          result.artist.push(textRunner[i].text)
        }
        break;
      case 'Album':
        result.type = type;
        result.browseId = playNavigationEndpoint.browseEndpoint?.browseId;

        if (i < (textRunner.length - 2) & ((i % 2) === 0)) {
          if (!result.artist) {
            result.artist = []
          }
          result.artist.push(textRunner[i].text)
        }
        break;

      default:
        return;
      }

    };

    return result
  }