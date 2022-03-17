import googleSuggest from './googleSuggest.js'
import getSearch from '../ytMusic/getSearch.js'

export default async function extraInfo (searchQuery) {
  const {
    searchTerm,
    searchCountry
  } = searchQuery;

  const googleSuggestRes = await googleSuggest({
    searchTerm: searchTerm,
    searchCountry: searchCountry,
  })
  const googleSuggestResStr = await JSON.stringify(googleSuggestRes);
  console.log(googleSuggestRes)
  const extraData = {}
  //Cheak if this is a movie or web-series
  if (/(movie)/g.test(googleSuggestResStr)) {
    console.log("movie")
    extraData.type = "movie"
    // search YTM
    const songs = await getSearch({
      searchTerm: `${searchTerm} movie`,
      getOnly: ["Songs"]
    })
    //    console.log(songs)
    extraData.songs = songs.song;
  }
  //Cheak if this is a web-series
  else if (/(season)/g.test(googleSuggestResStr)) {
    console.log("web-series")
    extraData.type = "web-series"
    // search YTM
    const songs = await getSearch({
      searchTerm: `${searchTerm} web-series`,
      getOnly: ['Songs']

    })
    // console.log(songs)
    extraData.songs = songs.song;
  }
  //Cheak if this is a Song
  else if (/(song|singer|lyric|chord|music)/g.test(googleSuggestResStr)) {
    extraData.type = "song"
    const songs = await getSearch({
      searchTerm: searchTerm,
      getOnly: ['Songs']
    })
    //  console.log(songs.song[0])
    extraData.songs = [songs.song[0]];
  } else {
    extraData.type = "other"
    console.log("other")
  }
  console.log(extraData)
  return extraData
}
