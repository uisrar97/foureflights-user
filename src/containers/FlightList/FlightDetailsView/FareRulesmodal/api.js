import Axios from '../../../../utils/service';

export const fetchRules = async (data) =>  {
  let fareRulesObject = {
    "adult":data.flightData.adult,
    "infant":data.flightData.infant,
    "child":data.flightData.children,
    "segmentsData": data.singleFlight
  };

  try
  {
    let res = await Axios.post("api/get-farerules", fareRulesObject);
    return res['data'];
  }
  catch (error)
  {
    return error;
  }
}
