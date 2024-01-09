import Axios from '../../utils/service';

export const fetchEvents = async (api) => {
  try
  {
    let res = await Axios.get(api);
    return res['data'];
  } catch (error)
  {
    return error;
  }
}