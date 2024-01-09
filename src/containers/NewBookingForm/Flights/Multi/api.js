import Axios from "../../../../utils/service";

export const fetchEvents = async (data, fields) => {
  const multiTravelHititAPI = `api/multi-trip-search?ticket_class=${data.cabin}&from_date=[${data.from_date}]&from=[${data.from}]&to=[${data.to}]&ummrah=${data.ummrah}&adult=${data.adult}&infant=${data.infant}&children=${data.children}`;
  const multiAirblueAPI = `api/multi-trip-search-airblue?ticket_class=${data.cabin}&from_date=[${data.from_date}]&from=[${data.from}]&to=[${data.to}]&adult=${data.adult}&infant=${data.infant}&children=${data.children}`;

  let QueryCities = [];

  let TravelHitit = true; //To include Travelport & Hitit
  // let TravelHitit = false; //To exclude Travelport & Hitit

  if (fields.length > 0) {
    fields.map((fld) => {
      let fromCity = fld.fromAirport.slice(0, 3);
      let toCity = fld.toAirport.slice(0, 3);
      let fromDate = fld.departureDate;

      QueryCities.push({
        Origin: fromCity,
        Destination: toCity,
        DepartureDate: fromDate,
      });
    });
  }
  if (TravelHitit) {
    try {
      let resTravelHitit = "";
      let resAirblue = "";

      const response = {
        message: "Multi City Search List",
        status: "",
        result: {
          api_type: "",
          flight_type: "",
          flights: [],
        },
      };

      resTravelHitit = await Axios.get(multiTravelHititAPI);

      resAirblue = await Axios.get(multiAirblueAPI);

      if (resTravelHitit.data.status === "200") {
        response.status = resTravelHitit.data.status;
        response.result.api_type = resTravelHitit.data.result.api_type;
        response.result.flight_type = resTravelHitit.data.result.flight_type;
        response.result.flights = resTravelHitit.data.result.flights;
      }

      if (resAirblue.data.status === "200") {
        response.status = resAirblue.data.status;
        response.result.api_type = resAirblue.data.result.api_type;
        response.result.flight_type = resAirblue.data.result.flight_type;

        let airblueFlights = [];

        if (
          resAirblue.data.result.flights.length > 0 &&
          QueryCities.length > 0
        ) {
          QueryCities.map((que, index) => {
            if (index === 0) {
              resAirblue.data.result.flights.map((airblue) => {
                let fltDate = new Date(
                  airblue.segments.DepartureDateTime
                ).toDateString();
                let queDate = new Date(que.DepartureDate).toDateString();
                if (
                  airblue.segments.Origin === que.Origin &&
                  airblue.segments.Destination === que.Destination &&
                  fltDate === queDate
                ) {
                  response.result.flights.push(airblue);
                }
              });
            } else {
              airblueFlights.push(
                resAirblue.data.result.flights.map((airblue) => {
                  let fltDate = new Date(
                    airblue.segments.DepartureDateTime
                  ).toDateString();
                  let queDate = new Date(que.DepartureDate).toDateString();
                  if (
                    airblue.segments.Origin === que.Origin &&
                    airblue.segments.Destination === que.Destination &&
                    fltDate === queDate
                  ) {
                    return airblue;
                  }
                })
              );
            }
          });

          for (let i = 0; i < airblueFlights.length; i++) {
            airblueFlights[i] = airblueFlights[i].filter(Boolean);
          }
          response.result.flights.push(airblueFlights);
        }
      }
      return response;
    } catch (error) {
      return error;
    }
  } else {
    try {
      let resTravelHitit = "";
      let resAirblue = "";

      const response = {
        message: "Multi City Search List",
        status: "",
        result: {
          api_type: "",
          flight_type: "",
          flights: [],
        },
      };

      resAirblue = await Axios.get(multiAirblueAPI);

      if (resAirblue.data.status === "200") {
        response.status = resAirblue.data.status;
        response.result.api_type = resAirblue.data.result.api_type;
        response.result.flight_type = resAirblue.data.result.flight_type;

        let airblueFlights = [];

        if (
          resAirblue.data.result.flights.length > 0 &&
          QueryCities.length > 0
        ) {
          QueryCities.map((que, index) => {
            if (index === 0) {
              resAirblue.data.result.flights.map((airblue) => {
                let fltDate = new Date(
                  airblue.segments.DepartureDateTime
                ).toDateString();
                let queDate = new Date(que.DepartureDate).toDateString();
                if (
                  airblue.segments.Origin === que.Origin &&
                  airblue.segments.Destination === que.Destination &&
                  fltDate === queDate
                ) {
                  response.result.flights.push(airblue);
                }
              });
            } else {
              airblueFlights.push(
                resAirblue.data.result.flights.map((airblue) => {
                  let fltDate = new Date(
                    airblue.segments.DepartureDateTime
                  ).toDateString();
                  let queDate = new Date(que.DepartureDate).toDateString();
                  if (
                    airblue.segments.Origin === que.Origin &&
                    airblue.segments.Destination === que.Destination &&
                    fltDate === queDate
                  ) {
                    return airblue;
                  }
                })
              );
            }
          });

          for (let i = 0; i < airblueFlights.length; i++) {
            airblueFlights[i] = airblueFlights[i].filter(Boolean);
          }
          response.result.flights.push(airblueFlights);
        }
      }
      return response;
    } catch (error) {
      return error;
    }
  }
};

export const bookMultiFlight = async (data) => {
  try {
    const res = await Axios.post("api/book-flight", data);
    return res["data"];
  } catch (error) {
    return error;
  }
};

export const getMultiFlight = async (pnr, last_name, endpoint) => {
  try {
    let res = await Axios.get(endpoint, {
      params: { pnr: pnr, last_name: last_name },
    });
    return res["data"];
  } catch {
    return error;
  }
};
