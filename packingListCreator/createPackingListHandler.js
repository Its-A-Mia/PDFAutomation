import createPackingList from './packingListCreatorPkg/createPackingList.js';

export const handler = async (event) => {
  let request = event;
  console.info(request);

  let data = request.queryStringParameters;

  console.info(data);

  if (data.recordId && data.dealId) {
    let res = await createPackingList(data.recordId, data.dealId);
    console.info(res);
    console.info('Request successful');
    return { statusCode: 200, body: JSON.stringify(res) };
  } else {
    throw new Error(
      `Request must contain a recordId and dealId. Received recordId: ${recordId ? recordId : 'none'} dealId: ${
        dealId ? dealId : 'none'
      }`
    );
  }
};
