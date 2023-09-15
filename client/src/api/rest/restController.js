import http from '../interceptor';
import queryString from 'query-string'

export const registerRequest = data => http.post('user/registration', data);
export const loginRequest = data => http.post('user/login', data);
export const getUser = () => http.post('user/getUser');
export const updateContest = data => http.patch('contest/updateContest', data);
export const setNewOffer = data => http.post('contest/setNewOffer', data);
export const setOfferStatus = data => http.post('contest/setOfferStatus', data);
export const downloadContestFile = data =>
  http.get(`contest/downloadFile/${data.fileName}`);
export const payMent = data => http.post('user/pay', data.formData);
export const changeMark = data => http.post('user/changeMark', data);
export const getPreviewChat = () => http.post('chat/getPreview');
export const getDialog = (data) => http.get('chat/getChat');
export const dataForContest = data => http.post('contest/dataForContest', data);
export const cashOut = data => http.post('user/cashout', data);
export const updateUser = data => http.post('user/updateUser', data);
export const newMessage = data => http.post('chat/newMessage', data);
export const changeChatFavorite = data => http.post('chat/favorite', data);
export const changeChatBlock = data => http.post('chat/blackList', data);
export const getCatalogList = data => http.post('chat/getCatalogs', data);
export const addChatToCatalog = data => http.post('chat/addNewChatToCatalog', data);
export const createCatalog = data => http.post('chat/createCatalog', data);
export const deleteCatalog = data => http.post('chat/deleteCatalog', data);
export const removeChatFromCatalog = data =>
  http.post('chat/removeChatFromCatalog', data);
export const changeCatalogName = data => http.post('chat/updateNameCatalog', data);
export const getCustomersContests = (data) =>
  //   http.get(
  //     `contest/byCustomer?limit${data.limit}&offset=${data.offset}&status=${data.contestStatus}`,
  // );
  http.get(`contest/byCustomer?${queryString.stringify(data)}`);

export const getActiveContests = (data) => http.get(`contest/getAllContests?${queryString.stringify(data)}`);

export const getContestById = ({contestId}) =>
  http.get(`contest/${contestId}`);

export const getOffers = () => http.get('offers');
export const getTransactions = (requestData) => {
  console.log('requestData', requestData);
  return http.get(`user/id/transactions?${queryString.stringify(requestData)}`)};