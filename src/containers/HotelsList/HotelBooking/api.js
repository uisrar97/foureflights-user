import Axios from '../../../utils/service';

export const submitHotelBookingDetails = async (data) =>  {
    try
    {
        const res= await Axios.post('api/book-hotel',data);
        return res['data'];
    }
    catch (error)
    {
        return error;
    }
  }