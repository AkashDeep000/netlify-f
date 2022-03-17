import extraInfo from '../dataFetch/extraInfo'
import ytsr from "ytsr"

const filterResult = async (youtubeResult) => {
   //filter youtubeResult
   console.log("filtering")
 const filterArray = await youtubeResult.items.filter(el => {
  const duration = el.duration?.replace(":", "")
  
  if (duration <= 60 && el.type == "video" && 
  el.title.toLowerCase().indexOf("ringtone") !== -1) {
    return true
  }
})
console.log(youtubeResult.items)
//creating filal result
const finalArray = await filterArray.map(el => {
  console.log("finalizing")
  const finalArray = {
      id: el.id,
      title: el.title,
      duration: parseInt(el.duration.replace(":",""), 10),
      thumbnails: el.bestThumbnail.url,
  }
 // console.log(finalArray)
  return finalArray
})
return finalArray;
}



exports.handler = async function (event, context) {
  const searchTerm = event.queryStringParameters.term
  const searchCont = JSON.stringify(event.queryStringParameters.cont);
  const country = event.queryStringParameters.country;
console.log(searchTerm, searchCont)
  if (searchTerm) {
    try {
      const filter = await ytsr.getFilters(`"ringtone" + ${searchTerm}`);
  const filter1 = filter.get('Type').get('Video');
  const filter2 = await ytsr.getFilters(filter1.url);
  const filter3 = filter2.get('Duration').get('Under 4 minutes');
  
  const firstResultBatch = async () => {
    const ytData = await ytsr(filter3.url, {
        pages: 1
      });
    const data = await filterResult(ytData)
    return data
  }
  
  const ytData = firstResultBatch();
  
     const extraInfoData = extraInfo({
       searchTerm: searchTerm,
       country: country,
      })
     const a = await Promise.all([extraInfo, ytData])
    
      return {
        statusCode: 200,
        body: JSON.stringify(a),
      };
    } catch (e) {
      console.log(e)
      return {
        statusCode: 404,
        body: JSON.stringify(e),
        }
      }
  } else if (searchCont) {
    try {
      const contResultBatch = await ytsr.continueReq(searchCont);
      const body = await filterResult(contResultBatch)
      return {
        statusCode: 200,
        body: JSON.stringify(body),
      };
    } catch (e) {
      console.log(e)
      return {
        statusCode: 404,
        body: JSON.stringify(e),
        }
      }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: "no search term or continuation id found"
      }),
    }
  }


}