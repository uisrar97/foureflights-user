import Axios from '../../utils/service';

export const fetchEvents = async (cnr, last_name, endpoint) => {
  try {
      let res = await Axios.get(endpoint,{ params: {cnr: cnr, last_name: last_name } });
    return res['data'];

  } catch (error) {
    return error;
  }
}