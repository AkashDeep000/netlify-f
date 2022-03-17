import ytsr from "ytsr"
import extraInfo from "../dataFetch/extraInfo"

const searchYoutube = async (options) => {
  const {
    searchTerm,
    searchCountry,
    searchPages
  } = options;
  const filter = await ytsr.getFilters(`"ringtone" + ${searchTerm}`);
  const filter1 = await filter.get('Type').get('Video');
  const filter2 = await ytsr.getFilters(filter1.url);
  const filter3 = await filter2.get('Duration').get('Under 4 minutes');

  const ytData = await ytsr(filter3.url, {
    ...(searchCountry ? {
      gl: searchCountry
    }: {}),
    ...(searchPages ? {
      pages: searchPages
    }: {
      pages: 1
    }),
  });

  //filter youtubeResult
  console.log("filtering")
  const filterArray = await ytData.items.filter(el => {
    const duration = el.duration?.replace(":", "")

    if (duration <= 40 && el.type == "video" &&
      el.title.toLowerCase().indexOf("ringtone") !== -1) {
      return true
    }
  })
  //creating filal result
  const finalArray = await filterArray.map(el => {
    const finalArray = {
      id: el.id,
      title: el.title,
      duration: parseInt(el.duration.replace(":", ""), 10),
      thumbnails: el.bestThumbnail.url,
    }

    return finalArray
  })
  return {
    data: finalArray,
    cont: ytData.continuation,
  };

}
exports.handler = async function (event, context) {
  const searchTerm = event.queryStringParameters.term;
  const searchExtra = event.queryStringParameters.extra;
  const searchPages = event.queryStringParameters.pages;
  const searchCont = JSON.parse(event.queryStringParameters.cont);
  const searchCountry = event.queryStringParameters.country;

  if (searchTerm) {
    if (searchExtra == "true") {
      try {
        const dataYt = searchYoutube({
          searchTerm: searchTerm,
          searchCountry: searchCountry,
          searchPages: searchPages
        })
        const dataExtra = extraInfo({
          searchTerm: searchTerm,
          searchCountry: searchCountry,
        })
        const data = await Promise.all([dataExtra, dataYt])
        return {
          statusCode: 200,
          body: JSON.stringify(data),
        };
      } catch (e) {
        console.log(e);
        return {
          statusCode: 404,
          body: e,
        };
      }
    } else {
      try {
        const dataYt = await searchYoutube({
          searchTerm: searchTerm,
          searchCountry: searchCountry,
          searchPages: searchPages
        })
        const data = [{},
          dataYt]
        return {
          statusCode: 200,
          body: JSON.stringify(data),
        };
      } catch (e) {
        console.log;
        return {
          statusCode: 404,
          body: e,
        };
      }
    }
  } else if (searchCont) {
    const ytData = await ytsr.continueReq(searchCont);

    //filter youtubeResult
    console.log("filtering")

    const filterArray = await ytData.items.filter(el => {
      const duration = el.duration?.replace(":", "")

      if (duration <= 40 && el.type == "video" &&
        el.title.toLowerCase().indexOf("ringtone") !== -1) {
        return true
      }
    })
    //creating filal result
    const finalArray = await filterArray.map(el => {
      const finalArray = {
        id: el.id,
        title: el.title,
        duration: parseInt(el.duration.replace(":", ""), 10),
        thumbnails: el.bestThumbnail.url,
      }

      return finalArray
    })

    return {
      statusCode: 400,
      body: JSON.stringify([{},{data: finalArray,
        cont: ytData.continuation
      }]),


    };
  } else {

    return {
      statusCode: 404,
      body: "No searchTerm given",
    };
  }
}