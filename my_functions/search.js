import ytsr from "ytsr"

exports.handler = async function (event, context) {
  const searchTerm = event.queryStringParameters.term
  const searchCont = event.queryStringParameters.cont

  if (searchTerm) {
    try {
      const firstResultBatch = await ytsr(searchTerm, {
        pages: 1
      });
      return {
        statusCode: 200,
        body: JSON.stringify(firstResultBatch),
      };
    } catch (e) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: e
        }),
      }
    }
  } else if (searchCont) {
    try {
      const contResultBatch = await ytsr.continueReq(JSON.parse(searchCont));
      return {
        statusCode: 200,
        body: JSON.stringify(contResultBatch),
      };
    } catch (e) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: e
        }),
      }
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: "no search term on continuation id found"
      }),
    }
  }


}