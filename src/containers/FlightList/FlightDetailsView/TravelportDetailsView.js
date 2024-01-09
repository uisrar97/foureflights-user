import React, { useEffect, useState } from "react";
import {
  AirlineDetailsView,
  AirlineContainer,
  SegmentSection,
  FlightDetailsParent,
} from "../FlightDetails/wrapper/FlightDetailsStyle";
import Airplane from "../../../assets/img/airplane.webp";
import Segment from "../FlightDetails/segment/Segment";
import DetailsViewSidebar from "./DetailsViewSidebar";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import {
  time_convert,
  date_convert,
  utc_convert,
  time_zone,
  diff_minutes,
} from "../../../helper/ConvertFunctions";
import { AiFillRightCircle } from "react-icons/ai";

export const TravelportDetailsView = ({
  navigateTo,
  showModal,
  singleFlight,
  queryString,
  handleFlight,
  flights,
  layoutThird,
  layoutSecond,
  selectedNewFlight,
  setFlight,
  SetLayoutSecond,
  SetLayouttThird,
  SetSelectedNewFlight,
}) => {
  const { segments, BaggageInfo, price } = singleFlight;
  const [layoutIst, SetLayoutISt] = useState();
  const [showSegment, setshowSegment] = useState(true);

  let QueryCity = queryString.to.slice(6);
  QueryCity = QueryCity.split(",");

  const round = queryString.returnDate === "undefined" ? false : true;

  let totalFlightTime = 0;
  if (round) {
    let x = 0;

    segments.map((segment) => {
      if (x === 0) {
        totalFlightTime += Number(segment.FlightTime);
      }

      if (segment.destination_city_name.indexOf(QueryCity[0]) > -1) {
        x++;
      }
    });
  } else {
    totalFlightTime = segments.reduce(
      (accumulator, segment) => accumulator + Number(segment.FlightTime),
      0
    );
  }
  const handleComponent = () => {
    SetLayoutISt(!layoutIst);
    setshowSegment(true);
  };
  useEffect(() => {}, [selectedNewFlight, layoutThird, selectedNewFlight]);

  let TravelportInbound = [];
  flights.result.flights.map((flt) => {
    if (flt.provider_type === "travelport" && flt.segments !== "undefined") {
      TravelportInbound.push(flt);
    }
    return 0;
  });
  TravelportInbound = TravelportInbound.reduce(
    (uniqueFlights, currentFlight) => {
      if (currentFlight.provider_type == "travelport") {
        if (
          !uniqueFlights.some(
            (flight) =>
              flight.segments?.[0]?.FlightNumber ===
              currentFlight.segments?.[0]?.FlightNumber
          )
        ) {
          uniqueFlights.push(currentFlight);
        }
      }
      return uniqueFlights;
    },
    []
  );
  const travelportInboundList = (
    handleFlight,
    setFlight,
    SetLayoutSecond,
    SetLayouttThird,
    setshowSegment
  ) => {
    const handleFlightView = (flight) => {
      handleFlight(flight, "checking");
      setFlight([flight]);
      SetSelectedNewFlight(flight);
      SetLayouttThird(true);
      SetLayoutSecond(false);
      setshowSegment(false);
    };
    const FlightSegments = (segments) => {
      let layover = 0;
      let arr = 0;
      let dept = 0;
      segments.map((segment, index) => {
        if (
          segments.length > 1 &&
          index !== segments.length - 1 &&
          QueryCity[0].indexOf(segment.destination_city_name.split(",")[0]) ===
            -1 &&
          QueryCity[0] !== -1
        ) {
          arr += new Date(segments[index].ArrivalTime).getTime();

          dept += new Date(segments[index + 1].DepartureTime).getTime();
        }
        return (
          <ErrorBoundary key={index}>
            <li>
              {segments.length > 1 &&
                index !== segments.length - 1 &&
                segment.destination_city_name.indexOf(QueryCity[0]) === -1 && (
                  <div style={{}} className="col-md-12   text-center"></div>
                )}
            </li>
          </ErrorBoundary>
        );
      });
      return (
        <p
          style={{ width: 250 }}
          className="segment-details info  ml-4 pl-2
      "
        >
          <span className="small-head"> Total Layover:</span>
          {` ${diff_minutes(new Date(arr), new Date(dept))}`}
        </p>
      );
    };
    const filterFlight = singleFlight.segments.filter((seg) => seg.Group == 1);

    return TravelportInbound.map((flt, index) => {
      const removeDuplicateFlight = flt.segments.filter(
        (seg) => seg.Group === "1"
      );
      let istSeg = removeDuplicateFlight[0];
      if (filterFlight[0]?.FlightNumber !== istSeg?.FlightNumber) {
        return (
          <AirlineContainer style={{ marginTop: "24px" }}>
            {/* Segment Section Start */}
            <SegmentSection className="pr-2">
              {/* Segment Start */}
              {flt &&
                flt.segments
                  .filter((segment) => segment.Group === "1")
                  .map((segment, index) => (
                    <div key={index} className="segment">
                      <div className="logo-section">
                        <img alt="Airline Logo" src={segment.airline_logo} />
                      </div>
                      <div className="takeoff-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo takeoff"
                          src={Airplane}
                        />
                        <span title={time_zone(segment.DepartureTime)}>
                          {utc_convert(segment.DepartureTime)}
                        </span>
                        <h5>
                          <span>
                            {segment.origin_city_name}, {segment.Origin}
                          </span>
                        </h5>
                        <span>
                          <h6>{date_convert(segment.DepartureTime)}</h6>
                        </span>
                      </div>

                      {/* Stop Details (Desktop View) */}
                      <div className="stop-details">
                        <div className="size-12">Direct Flight</div>
                        <p className="dotted-line" />
                        <div className="flight-time">
                          <div>
                            Flight # {segment.Carrier}-{segment.FlightNumber}
                          </div>
                          <span>
                            Flight Time: {time_convert(segment.FlightTime)}
                          </span>
                          <div className="col-9">
                            <ul className="flights d-flex flex-column">
                              {FlightSegments(flt.segments)}
                            </ul>
                          </div>
                          <div>
                            {queryString.returnDate === "undefined"
                              ? ""
                              : "Round-Trip"}
                          </div>
                        </div>
                      </div>
                      {/* Stop Details (Mobile View) */}
                      <div className="mobile-stop-details">
                        <div className="size-12">Direct Flight</div>
                        <div className="flight-time">
                          <div>
                            Flight # {segment.Carrier}-{segment.FlightNumber}
                          </div>
                          <span>
                            Flight Time: {time_convert(segment.FlightTime)}
                          </span>
                        </div>
                      </div>
                      <div className="arrive-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo arrive"
                          src={Airplane}
                        />
                        <span title={time_zone(segment.ArrivalTime)}>
                          {utc_convert(segment.ArrivalTime)}
                        </span>
                        <h5>
                          <span>
                            {`${segment.destination_city_name}, ${segment.Destination}`}
                          </span>
                        </h5>
                        <span>
                          <h6>{date_convert(segment.ArrivalTime)}</h6>
                        </span>
                      </div>
                    </div>
                  ))}
              {/* Segment End */}
            </SegmentSection>
            {/* Segment Section End */}
            <div className="price-section">
              <button onClick={() => handleFlightView(flt)}>
                {" "}
                Select <AiFillRightCircle className="mb-1" />{" "}
              </button>
              <h3 style={{ marginTop: "8px" }}>
                {`${flt.price_info.TotalPrice.slice(0, 3)} ${Number(
                  flt.price
                )}`}
              </h3>
              <p>{`(incl.taxes & fees)`}</p>
            </div>
          </AirlineContainer>
        );
      }
    });
  };
  const inboundList = travelportInboundList(
    handleFlight,
    setFlight,
    SetLayoutSecond,
    SetLayouttThird,
    setshowSegment
  );

  if (!singleFlight.segments.some((obj) => obj.Group === "1") || layoutIst) {
    return singleFlight.segments !== null ? (
      <FlightDetailsParent key={Math.random()}>
        <ErrorBoundary>
          <div className="main">
            <AirlineDetailsView>
              <AirlineContainer>
                {/* Segment Section Start */}
                <SegmentSection className="pr-2">
                  {/* Segment Start */}
                  {singleFlight &&
                    singleFlight.segments.map((segment, index) => (
                      <div key={index} className="segment">
                        <div className="logo-section">
                          <img alt="Airline Logo" src={segment.airline_logo} />
                        </div>
                        <div className="takeoff-time">
                          <img
                            alt="Airplane Logo"
                            className="airplane-logo takeoff"
                            src={Airplane}
                          />
                          <span title={time_zone(segment.DepartureTime)}>
                            {utc_convert(segment.DepartureTime)}
                          </span>
                          <h5>
                            <span>
                              {segment.origin_city_name}, {segment.Origin}
                            </span>
                          </h5>
                          <span>
                            <h6>{date_convert(segment.DepartureTime)}</h6>
                          </span>
                        </div>

                        {/* Stop Details (Desktop View) */}
                        <div className="stop-details">
                          <div className="size-12">Direct Flight</div>
                          <p className="dotted-line" />
                          <div className="flight-time">
                            <div>
                              Flight # {segment.Carrier}-{segment.FlightNumber}
                            </div>
                            <span>
                              Flight Time: {time_convert(segment.FlightTime)}
                            </span>
                            <div>
                              {queryString.returnDate === "undefined"
                                ? ""
                                : "Round-Trip"}
                            </div>
                          </div>
                        </div>
                        {/* Stop Details (Mobile View) */}
                        <div className="mobile-stop-details">
                          <div className="size-12">Direct Flight</div>
                          <div className="flight-time">
                            <div>
                              Flight # {segment.Carrier}-{segment.FlightNumber}
                            </div>
                            <span>
                              Flight Time: {time_convert(segment.FlightTime)}
                            </span>
                          </div>
                        </div>
                        <div className="arrive-time">
                          <img
                            alt="Airplane Logo"
                            className="airplane-logo arrive"
                            src={Airplane}
                          />
                          <span title={time_zone(segment.ArrivalTime)}>
                            {utc_convert(segment.ArrivalTime)}
                          </span>
                          <h5>
                            <span>
                              {`${segment.destination_city_name}, ${segment.Destination}`}
                            </span>
                          </h5>
                          <span>
                            <h6>{date_convert(segment.ArrivalTime)}</h6>
                          </span>
                        </div>
                      </div>
                    ))}
                  {/* Segment End */}
                </SegmentSection>
                {/* Segment Section End */}
                <div className="price-section">
                  <h3>
                    {`${singleFlight.price_info.TotalPrice.slice(
                      0,
                      3
                    )} ${price}`}
                  </h3>
                  <p>{`(incl.taxes & fees)`}</p>
                </div>
              </AirlineContainer>
              <Segment
                segments={segments}
                BaggageInfo={BaggageInfo}
                totalFlightTime={totalFlightTime}
                QueryCity={QueryCity}
                round={round}
                showSegments={showSegment}
              />
            </AirlineDetailsView>
          </div>
          <DetailsViewSidebar
            queryString={queryString}
            showModal={showModal}
            singleFlight={singleFlight}
            navigateTo={navigateTo}
          />
        </ErrorBoundary>
      </FlightDetailsParent>
    ) : (
      ""
    );
  } else if (
    layoutSecond &&
    singleFlight.segments.some((obj) => obj.Group === "1")
  ) {
    return singleFlight.segments !== null ? (
      <FlightDetailsParent key={Math.random()}>
        <ErrorBoundary>
          <div className="main">
            <AirlineDetailsView>
              <AirlineContainer>
                <h4
                  style={{
                    textAlign: "center",
                    paddingTop: "20px",
                    marginBottom: "12px",
                  }}
                >
                  {" "}
                  Your Selected Flight{" "}
                </h4>
                {/* Segment Section Start */}
                <SegmentSection className="pr-2">
                  {/* Segment Start */}
                  {singleFlight &&
                    singleFlight.segments
                      .filter((segment) => segment.Group === "0")
                      .map((segment, index) => (
                        <div key={index} className="segment">
                          <div className="logo-section">
                            <img
                              alt="Airline Logo"
                              src={segment.airline_logo}
                            />
                          </div>
                          <div className="takeoff-time">
                            <img
                              alt="Airplane Logo"
                              className="airplane-logo takeoff"
                              src={Airplane}
                            />
                            <span title={time_zone(segment.DepartureTime)}>
                              {utc_convert(segment.DepartureTime)}
                            </span>
                            <h5>
                              <span>
                                {segment.origin_city_name}, {segment.Origin}
                              </span>
                            </h5>
                            <span>
                              <h6>{date_convert(segment.DepartureTime)}</h6>
                            </span>
                          </div>

                          {/* Stop Details (Desktop View) */}
                          <div className="stop-details">
                            <div className="size-12">Direct Flight</div>
                            <p className="dotted-line" />
                            <div className="flight-time">
                              <div>
                                Flight # {segment.Carrier}-
                                {segment.FlightNumber}
                              </div>
                              <span>
                                Flight Time: {time_convert(segment.FlightTime)}
                              </span>
                              <div>
                                {queryString.returnDate === "undefined"
                                  ? ""
                                  : "Round-Trip"}
                              </div>
                            </div>
                          </div>
                          {/* Stop Details (Mobile View) */}
                          <div className="mobile-stop-details">
                            <div className="size-12">Direct Flight</div>
                            <div className="flight-time">
                              <div>
                                Flight # {segment.Carrier}-
                                {segment.FlightNumber}
                              </div>
                              <span>
                                Flight Time: {time_convert(segment.FlightTime)}
                              </span>
                            </div>
                          </div>
                          <div className="arrive-time">
                            <img
                              alt="Airplane Logo"
                              className="airplane-logo arrive"
                              src={Airplane}
                            />
                            <span title={time_zone(segment.ArrivalTime)}>
                              {utc_convert(segment.ArrivalTime)}
                            </span>
                            <h5>
                              <span>
                                {`${segment.destination_city_name}, ${segment.Destination}`}
                              </span>
                            </h5>
                            <span>
                              <h6>{date_convert(segment.ArrivalTime)}</h6>
                            </span>
                          </div>
                        </div>
                      ))}
                  {/* Segment End */}
                </SegmentSection>
                {/* Segment Section End */}
                <div className="price-section">
                  {/* <h3>
                    {`${singleFlight.price_info.TotalPrice.slice(
                      0,
                      3
                    )} ${price}`}
                  </h3>
                  <p>{`(incl.taxes & fees)`}</p> */}
                </div>
              </AirlineContainer>
              {/* <Segment
                segments={segments}
                BaggageInfo={BaggageInfo}
                totalFlightTime={totalFlightTime}
                QueryCity={QueryCity}
                round={round}
              /> */}

              <h4
                style={{
                  textAlign: "center",
                  marginTop: "24px",
                  paddingBottom: "24px",
                }}
              >
                {" "}
                choose your incoming Flight{" "}
              </h4>
              <AirlineContainer>
                {/* Segment Section Start */}
                <SegmentSection className="pr-2">
                  {/* Segment Start */}
                  {singleFlight &&
                    singleFlight.segments
                      .filter((segment) => segment.Group === "1")
                      .map((segment, index) => (
                        <div key={index} className="segment">
                          <div className="logo-section">
                            <img
                              alt="Airline Logo"
                              src={segment.airline_logo}
                            />
                          </div>
                          <div className="takeoff-time">
                            <img
                              alt="Airplane Logo"
                              className="airplane-logo takeoff"
                              src={Airplane}
                            />
                            <span title={time_zone(segment.DepartureTime)}>
                              {utc_convert(segment.DepartureTime)}
                            </span>
                            <h5>
                              <span>
                                {segment.origin_city_name}, {segment.Origin}
                              </span>
                            </h5>
                            <span>
                              <h6>{date_convert(segment.DepartureTime)}</h6>
                            </span>
                          </div>

                          {/* Stop Details (Desktop View) */}
                          <div className="stop-details">
                            <div className="size-12">Direct Flight</div>
                            <p className="dotted-line" />
                            <div className="flight-time">
                              <div>
                                Flight # {segment.Carrier}-
                                {segment.FlightNumber}
                              </div>
                              <span>
                                Flight Time: {time_convert(segment.FlightTime)}
                              </span>
                              <div>
                                {queryString.returnDate === "undefined"
                                  ? ""
                                  : "Round-Trip"}
                              </div>
                            </div>
                          </div>
                          {/* Stop Details (Mobile View) */}
                          <div className="mobile-stop-details">
                            <div className="size-12">Direct Flight</div>
                            <div className="flight-time">
                              <div>
                                Flight # {segment.Carrier}-
                                {segment.FlightNumber}
                              </div>
                              <span>
                                Flight Time: {time_convert(segment.FlightTime)}
                              </span>
                            </div>
                          </div>
                          <div className="arrive-time">
                            <img
                              alt="Airplane Logo"
                              className="airplane-logo arrive"
                              src={Airplane}
                            />
                            <span title={time_zone(segment.ArrivalTime)}>
                              {utc_convert(segment.ArrivalTime)}
                            </span>
                            <h5>
                              <span>
                                {`${segment.destination_city_name}, ${segment.Destination}`}
                              </span>
                            </h5>
                            <span>
                              <h6>{date_convert(segment.ArrivalTime)}</h6>
                            </span>
                          </div>
                        </div>
                      ))}
                  {/* Segment End */}
                </SegmentSection>
                {/* Segment Section End */}
                <div className="price-section">
                  <button onClick={handleComponent}>
                    {" "}
                    Select <AiFillRightCircle className="mb-1" />{" "}
                  </button>
                  <h3 style={{ marginTop: "8px" }}>
                    {`${singleFlight.price_info.TotalPrice.slice(
                      0,
                      3
                    )} ${price}`}
                  </h3>
                  <p>{`(incl.taxes & fees)`}</p>
                </div>
              </AirlineContainer>
              <div style={{ marginTop: "24px" }}>{inboundList}</div>
            </AirlineDetailsView>
          </div>
          <DetailsViewSidebar
            queryString={queryString}
            showModal={showModal}
            singleFlight={singleFlight}
            navigateTo={navigateTo}
          />
        </ErrorBoundary>
      </FlightDetailsParent>
    ) : (
      ""
    );
  } else if (layoutThird && selectedNewFlight !== undefined) {
    return selectedNewFlight?.segments !== null ? (
      <FlightDetailsParent key={Math.random()}>
        <ErrorBoundary>
          <div className="main">
            <AirlineDetailsView>
              <AirlineContainer>
                {/* Segment Section Start */}
                <SegmentSection className="pr-2">
                  {/* Segment Start */}
                  {selectedNewFlight &&
                    selectedNewFlight.segments.map((segment, index) => (
                      <div key={index} className="segment">
                        <div className="logo-section">
                          <img alt="Airline Logo" src={segment.airline_logo} />
                        </div>
                        <div className="takeoff-time">
                          <img
                            alt="Airplane Logo"
                            className="airplane-logo takeoff"
                            src={Airplane}
                          />
                          <span title={time_zone(segment.DepartureTime)}>
                            {utc_convert(segment.DepartureTime)}
                          </span>
                          <h5>
                            <span>
                              {segment.origin_city_name}, {segment.Origin}
                            </span>
                          </h5>
                          <span>
                            <h6>{date_convert(segment.DepartureTime)}</h6>
                          </span>
                        </div>

                        {/* Stop Details (Desktop View) */}
                        <div className="stop-details">
                          <div className="size-12">Direct Flight</div>
                          <p className="dotted-line" />
                          <div className="flight-time">
                            <div>
                              Flight # {segment.Carrier}-{segment.FlightNumber}
                            </div>
                            <span>
                              Flight Time: {time_convert(segment.FlightTime)}
                            </span>
                            <div>
                              {queryString.returnDate === "undefined"
                                ? ""
                                : "Round-Trip"}
                            </div>
                          </div>
                        </div>
                        {/* Stop Details (Mobile View) */}
                        <div className="mobile-stop-details">
                          <div className="size-12">Direct Flight</div>
                          <div className="flight-time">
                            <div>
                              Flight # {segment.Carrier}-{segment.FlightNumber}
                            </div>
                            <span>
                              Flight Time: {time_convert(segment.FlightTime)}
                            </span>
                          </div>
                        </div>
                        <div className="arrive-time">
                          <img
                            alt="Airplane Logo"
                            className="airplane-logo arrive"
                            src={Airplane}
                          />
                          <span title={time_zone(segment.ArrivalTime)}>
                            {utc_convert(segment.ArrivalTime)}
                          </span>
                          <h5>
                            <span>
                              {`${segment.destination_city_name}, ${segment.Destination}`}
                            </span>
                          </h5>
                          <span>
                            <h6>{date_convert(segment.ArrivalTime)}</h6>
                          </span>
                        </div>
                      </div>
                    ))}
                  {/* Segment End */}
                </SegmentSection>
                {/* Segment Section End */}
                <div className="price-section">
                  <h3>
                    {`${selectedNewFlight?.price_info?.TotalPrice.slice(
                      0,
                      3
                    )} ${Number(selectedNewFlight?.price)}`}
                  </h3>
                  <p>{`(incl.taxes & fees)`}</p>
                </div>
              </AirlineContainer>
              <Segment
                segments={selectedNewFlight.segments}
                BaggageInfo={BaggageInfo}
                totalFlightTime={totalFlightTime}
                QueryCity={QueryCity}
                round={round}
                showSegment={showSegment}
              />
            </AirlineDetailsView>
          </div>
          <DetailsViewSidebar
            queryString={queryString}
            showModal={showModal}
            singleFlight={selectedNewFlight}
            navigateTo={navigateTo}
          />
        </ErrorBoundary>
      </FlightDetailsParent>
    ) : (
      ""
    );
  }
};

export default TravelportDetailsView;
