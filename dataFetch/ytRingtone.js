import ytsr from "ytsr"

export default async function Search (searchQuery){
  const searchTerm = searchQuery.searchTerm;
  const searchCont = searchQuery.searchCont;
  const country = searchQuery.country;
  console.log("YT start")
  /*const youtubeResult = await ytsr(searchTerm, {
        gl : country,
        limit: 10
    })*/
  if (searchCont) {
    const youtubeResult = await ytsr.continueReq(searchCont);
  } else {
  const filters1 = await ytsr.getFilters(`"ringtone" + ${searchTerm}`);
  const filter1 = filters1.get('Type').get('Video');
  const filters2 = await ytsr.getFilters(filter1.url);
  const filter2 = filters2.get('Duration').get('Under 4 minutes');
  
  const options = {
  pages: 1,
}

  const youtubeResult = await ytsr(filter2.url, options);
  }  
  
  console.log("YT End")  
 //filter youtubeResult
 const filterArray = await youtubeResult.items.filter(el => {
  const duration = el.duration?.replace(":", "")
  
  if (duration <= 60 && el.type == "video" && 
  el.title.toLowerCase().indexOf("ringtone") !== -1) {
    return true
  }
})
//creating filal result
const finalArray = await filterArray.map(el => {
  const finalArray = {
      id: el.id,
      title: el.title,
      duration: parseInt(el.duration.replace(":",""), 10),
      thumbnails: el.bestThumbnail.url,
  }
    
  return finalArray
})
 
/*
const filterArray = await ytsr.GetData(searchTerm,false,40)

//creating filal result
const finalArray = await filterArray.items.map(el => {
  const finalArray = {
      id: el.id,
      title: el.title,
      duration: el.length?.simpleText,
      thumbnail: el.thumbnail.thumbnails[1]?.url,
  }
   
  return finalArray 
})
*/
    //return "☑️☑️☑️ ytsr complete";
const data = {
  originalQuery: youtubeResult.originalQuery.slice(13),
  correctedQuery: youtubeResult.correctedQuery.slice(13),
  items: finalArray,
}
console.log("YT data Calculated")
    return data;
  }
  