import ytsr from "ytsr"

exports.handler = async function (event, context) {
  const firstResultBatch = await ytsr('github', { pages: 1 });
  return {
    statusCode: 200,
    body: JSON.stringify(firstResultBatch),
  };
}