import Axios from '../../../utils/service';

export const submitFlightDetails = async (data) =>  {
  try
  {
   const res= await Axios.post('api/book-flight',data);
    return res['data'];
  }
  catch (error)
  {
    return error;
  }
}
