import React, { useState } from "react";
import {
  AirlineDetailsView,
  AirlineContainer,
  SegmentSection,
  FlightDetailsParent,
  Details,
} from "../FlightDetails/wrapper/FlightDetailsStyle";
import Airplane from "../../../assets/img/airplane.webp";
import Hititsegment from "../FlightDetails/segment/Hititsegment";
import DetailsViewSidebar from "./DetailsViewSidebar";
import ErrorBoundary from "./../../../helper/ErrorBoundary";
import {
  time_convert,
  date_convert,
  utc_convert,
  time_zone,
  diff_minutes_layover,
} from "../../../helper/ConvertFunctions";
import { AiFillRightCircle } from "react-icons/ai";

export const HititDetailsView = ({
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
  layoutIst,
  SetLayoutISt,
  showSegments,
  setShowSegments,
}) => {
  const { segments, price_info } = singleFlight;
  const { cabin } = queryString;
  const [handleSegment, setHandleSegment] = useState();
  // const [layoutSecond, SetLayoutSecond] = useState();
  // const [layoutThird, SetLayouttThird] = useState();
  // const [selectedNewFlight, SetSelectedNewFlight] = useState();
  let HititInbound = [];
  flights.result.flights.map((flt) => {
    if (
      flt.provider_type === "hitit" &&
      flt.segments &&
      flt.segments.Inbound !== undefined
    ) {
      HititInbound.push(flt);
    }
    return 0;
  });

  HititInbound = HititInbound.reduce((uniqueFlights, currentFlight) => {
    if (currentFlight.provider_type === "hitit") {
      if (
        !uniqueFlights.some(
          (flight) =>
            flight.segments?.Inbound?.[0]?.segment_data?.FlightNumber ===
            currentFlight.segments?.Inbound?.[0]?.segment_data?.FlightNumber
        )
      ) {
        uniqueFlights.push(currentFlight);
      }
    }
    return uniqueFlights;
  }, []);

  const hititInboundList = (
    handleFlight,
    setFlight,
    SetLayoutSecond,
    SetLayouttThird,
    SetLayoutISt,
    setShowSegments
  ) => {
    const handleFlightView = (flight) => {
      handleFlight(flight, "checking");
      setFlight([flight]);
      SetSelectedNewFlight(flight);
      SetLayouttThird(true);
      SetLayoutSecond(false);
      SetLayoutISt(false);
      setShowSegments(true);

      // handleFlight(flight);
    };

    return HititInbound.map((flt, index) => {
      const { segments } = flt;
      let lengthOut = flt.segments.Outbound.length;

      const lengthIn = flt.segments.Inbound ? segments.Inbound.length : 0;

      const OutboundLayover = () => {
        let outboundLayover = 0;
        flt.segments.Outbound.map((outbound, index) => {
          if ((lengthOut > 1 || segments.Inbound) && index + 1 !== lengthOut) {
            outboundLayover = diff_minutes_layover(
              outbound.segment_data.ArrivalTime,
              segments.Outbound[index + 1].segment_data.DepartureTime
            );
          }
        });

        return outboundLayover;
      };

      const InboundLayover = () => {
        let inboundlayover = 0;
        if (flt.segments.Inbound) {
          flt.segments.Inbound.map((inboundData, index) => {
            if (lengthIn > 1 && index + 1 !== lengthIn) {
              inboundlayover = diff_minutes_layover(
                inboundData.segment_data.ArrivalTime,
                segments.Inbound[index + 1].segment_data.DepartureTime
              );
            }
          });
        }
        return inboundlayover;
      };
      let totalLAyover = (InboundLayover() + OutboundLayover()) / 1000;
      const removeSingleRepeatedFlight =
        singleFlight.segments.Inbound[0].segment_data.FlightNumber;
      if (
        flt.segments.Inbound[0].segment_data.FlightNumber !==
        removeSingleRepeatedFlight
      ) {
        return (
          <AirlineContainer style={{ marginTop: "24px" }}>
            {/* Segment Section Start */}
            <SegmentSection className="pr-2">
              {/* Segment Start */}
              {segments.Inbound
                ? [
                    segments.Inbound.map((inbound) => (
                      <div key={Math.random()} className="segment">
                        <div className="logo-section">
                          <img
                            alt="Airline Logo"
                            src={inbound.segment_data.airline_logo}
                          />
                        </div>
                        <div className="takeoff-time">
                          <img
                            alt="Airplane Logo"
                            className="airplane-logo takeoff"
                            src={Airplane}
                          />
                          <span
                            title={time_zone(
                              inbound.segment_data.DepartureTime
                            )}
                          >
                            {utc_convert(inbound.segment_data.DepartureTime)}
                          </span>
                          <h5>
                            <span>
                              {inbound.segment_data.origin_city_name},{" "}
                              {inbound.segment_data.Origin}
                            </span>
                          </h5>
                          <span>
                            <h6>
                              {date_convert(inbound.segment_data.DepartureTime)}
                            </h6>
                          </span>
                        </div>
                        {/* Stop Details (Desktop View) */}
                        <div className="stop-details">
                          <div className="size-12">Direct Flight</div>
                          <p className="dotted-line" />
                          <div className="flight-time">
                            <div>
                              Flight # {inbound.segment_data.Carrier}-
                              {inbound.segment_data.FlightNumber}
                            </div>
                            <span>
                              Flight Time:{" "}
                              {time_convert(inbound.segment_data.FlightTime)}
                            </span>
                            <div
                              style={{ fontSize: "10px" }}
                              className="col-9 ml-4 "
                            >
                              Total Flight Layover:
                              {time_convert(
                                Math.abs(Math.round(totalLAyover / 60))
                              )}
                            </div>
                            <div>{segments.Inbound ? "Round-Trip" : ""}</div>
                          </div>
                        </div>
                        {/* Stop Details (Mobile View) */}
                        <div className="mobile-stop-details">
                          <div className="size-12">Direct Flight</div>
                          <div className="flight-time">
                            <div>
                              Flight # {inbound.segment_data.Carrier}-
                              {inbound.segment_data.FlightNumber}
                            </div>
                            i am here
                            <span>
                              Flight Time:{" "}
                              {time_convert(inbound.segment_data.FlightTime)}
                            </span>
                            <div>{segments.Inbound ? "Round-Trip" : ""}</div>
                          </div>
                        </div>
                        <div className="arrive-time">
                          <img
                            alt="Airplane Logo"
                            className="airplane-logo arrive"
                            src={Airplane}
                          />
                          <span
                            title={time_zone(inbound.segment_data.ArrivalTime)}
                          >
                            {utc_convert(inbound.segment_data.ArrivalTime)}
                          </span>
                          <h5>
                            <span>
                              {`${inbound.segment_data.destination_city_name}, ${inbound.segment_data.Destination}`}
                            </span>
                          </h5>
                          <span>
                            <h6>
                              {date_convert(inbound.segment_data.ArrivalTime)}
                            </h6>
                          </span>
                        </div>
                      </div>
                    )),
                  ]
                : segments.Outbound.map((outbound) => (
                    <div key={Math.random()} className="segment">
                      <div className="logo-section">
                        <img
                          alt="Airline Logo"
                          src={outbound.segment_data.airline_logo}
                        />
                      </div>
                      <div className="takeoff-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo takeoff"
                          src={Airplane}
                        />
                        <span
                          title={time_zone(outbound.segment_data.DepartureTime)}
                        >
                          {utc_convert(outbound.segment_data.DepartureTime)}
                        </span>
                        <h5>
                          <span>
                            {outbound.segment_data.origin_city_name},{" "}
                            {outbound.segment_data.Origin}
                          </span>
                        </h5>
                        <span>
                          <h6>
                            {date_convert(outbound.segment_data.DepartureTime)}
                          </h6>
                        </span>
                      </div>
                      {/* Stop Details (Desktop View) */}
                      <div className="stop-details">
                        <div className="size-12">Direct Flight</div>
                        <p className="dotted-line" />
                        <div className="flight-time">
                          <div>
                            Flight # {outbound.segment_data.Carrier}-
                            {outbound.segment_data.FlightNumber}
                          </div>
                          <span>
                            Flight Time:{" "}
                            {time_convert(outbound.segment_data.FlightTime)}
                          </span>
                          <div>{segments.Inbound ? "Round-Trip" : ""}</div>
                        </div>
                      </div>
                      {/* Stop Details (Mobile View) */}
                      <div className="mobile-stop-details">
                        <div className="size-12">Direct Flight</div>
                        <div className="flight-time">
                          <div>
                            Flight # {outbound.segment_data.Carrier}-
                            {outbound.segment_data.FlightNumber}
                          </div>
                          <span>
                            Flight Time:{" "}
                            {time_convert(outbound.segment_data.FlightTime)}
                          </span>
                          <div>{segments.Inbound ? "Round-Trip" : ""}</div>
                        </div>
                      </div>
                      <div className="arrive-time">
                        <img
                          alt="Airplane Logo"
                          className="airplane-logo arrive"
                          src={Airplane}
                        />
                        <span
                          title={time_zone(outbound.segment_data.ArrivalTime)}
                        >
                          {utc_convert(outbound.segment_data.ArrivalTime)}
                        </span>
                        <h5>
                          <span>
                            {`${outbound.segment_data.destination_city_name}, ${outbound.segment_data.Destination}`}
                          </span>
                        </h5>
                        <span>
                          <h6>
                            {date_convert(outbound.segment_data.ArrivalTime)}
                          </h6>
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
                {`${
                  flt.price_info.pricingOverview.totalAmount.currency.code
                } ${Number(flt.price)}`}
              </h3>
              <p>(incl.taxes & fees)</p>
            </div>
          </AirlineContainer>
        );
      }
    });
  };

  const handleComponent = () => {
    SetLayoutISt(false);
    SetLayoutSecond(true);
  };

  const inboundList = hititInboundList(
    handleFlight,
    setFlight,
    SetLayoutSecond,
    SetLayouttThird,
    SetLayoutISt,
    setShowSegments
  );
  if (singleFlight.segments.Inbound == undefined) {
    return (
      singleFlight.segments !== null && (
        <FlightDetailsParent key={Math.random()}>
          <ErrorBoundary>
            <div className="main">
              <AirlineDetailsView>
                <AirlineContainer>
                  {/* Segment Section Start */}
                  <SegmentSection className="pr-2">
                    {/* Segment Start */}
                    {segments.Inbound == undefined
                      ? [
                          segments.Outbound.map((outbound) => (
                            <div key={Math.random()} className="segment">
                              <div className="logo-section">
                                <img
                                  alt="Airline Logo"
                                  src={outbound.segment_data.airline_logo}
                                />
                              </div>
                              <div className="takeoff-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo takeoff"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    outbound.segment_data.DepartureTime
                                  )}
                                >
                                  {utc_convert(
                                    outbound.segment_data.DepartureTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {outbound.segment_data.origin_city_name},{" "}
                                    {outbound.segment_data.Origin}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      outbound.segment_data.DepartureTime
                                    )}
                                  </h6>
                                </span>
                              </div>
                              {/* Stop Details (Desktop View) */}
                              <div className="stop-details">
                                <div className="size-12">Direct Flight</div>
                                <p className="dotted-line" />
                                <div className="flight-time">
                                  <div>
                                    Flight # {outbound.segment_data.Carrier}-
                                    {outbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      outbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              {/* Stop Details (Mobile View) */}
                              <div className="mobile-stop-details">
                                <div className="size-12">Direct Flight</div>
                                <div className="flight-time">
                                  <div>
                                    Flight # {outbound.segment_data.Carrier}-
                                    {outbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      outbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="arrive-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo arrive"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                >
                                  {utc_convert(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {`${outbound.segment_data.destination_city_name}, ${outbound.segment_data.Destination}`}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      outbound.segment_data.ArrivalTime
                                    )}
                                  </h6>
                                </span>
                              </div>
                            </div>
                          )),
                        ]
                      : segments.Outbound.map((outbound) => (
                          <div key={Math.random()} className="segment">
                            <div className="logo-section">
                              <img
                                alt="Airline Logo"
                                src={outbound.segment_data.airline_logo}
                              />
                            </div>
                            <div className="takeoff-time">
                              <img
                                alt="Airplane Logo"
                                className="airplane-logo takeoff"
                                src={Airplane}
                              />
                              <span
                                title={time_zone(
                                  outbound.segment_data.DepartureTime
                                )}
                              >
                                {utc_convert(
                                  outbound.segment_data.DepartureTime
                                )}
                              </span>
                              <h5>
                                <span>
                                  {outbound.segment_data.origin_city_name},{" "}
                                  {outbound.segment_data.Origin}
                                </span>
                              </h5>
                              <span>
                                <h6>
                                  {date_convert(
                                    outbound.segment_data.DepartureTime
                                  )}
                                </h6>
                              </span>
                            </div>
                            {/* Stop Details (Desktop View) */}
                            <div className="stop-details">
                              <div className="size-12">Direct Flight</div>
                              <p className="dotted-line" />
                              <div className="flight-time">
                                <div>
                                  Flight # {outbound.segment_data.Carrier}-
                                  {outbound.segment_data.FlightNumber}
                                </div>
                                <span>
                                  Flight Time:{" "}
                                  {time_convert(
                                    outbound.segment_data.FlightTime
                                  )}
                                </span>
                                <div>
                                  {segments.Inbound ? "Round-Trip" : ""}
                                </div>
                              </div>
                            </div>
                            {/* Stop Details (Mobile View) */}
                            <div className="mobile-stop-details">
                              <div className="size-12">Direct Flight</div>
                              <div className="flight-time">
                                <div>
                                  Flight # {outbound.segment_data.Carrier}-
                                  {outbound.segment_data.FlightNumber}
                                </div>
                                <span>
                                  Flight Time:{" "}
                                  {time_convert(
                                    outbound.segment_data.FlightTime
                                  )}
                                </span>
                                <div>
                                  {segments.Inbound ? "Round-Trip" : ""}
                                </div>
                              </div>
                            </div>
                            <div className="arrive-time">
                              <img
                                alt="Airplane Logo"
                                className="airplane-logo arrive"
                                src={Airplane}
                              />
                              <span
                                title={time_zone(
                                  outbound.segment_data.ArrivalTime
                                )}
                              >
                                {utc_convert(outbound.segment_data.ArrivalTime)}
                              </span>
                              <h5>
                                <span>
                                  {`${outbound.segment_data.destination_city_name}, ${outbound.segment_data.Destination}`}
                                </span>
                              </h5>
                              <span>
                                <h6>
                                  {date_convert(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                </h6>
                              </span>
                            </div>
                          </div>
                        ))}
                    {/* Segment End */}
                  </SegmentSection>
                  {/* Segment Section End */}
                  <div className="price-section">
                    <h3>
                      {`${
                        singleFlight.price_info.pricingOverview.totalAmount
                          .currency.code
                      } ${Number(singleFlight.price)}`}
                    </h3>
                    <p>(incl.taxes & fees)</p>
                  </div>
                </AirlineContainer>
                <Hititsegment
                  cabin={cabin}
                  segments={segments}
                  price_info={price_info}
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
      )
    );
  } else if (layoutIst) {
    return (
      singleFlight.segments !== null &&
      singleFlight.segments.Inbound !== undefined && (
        <FlightDetailsParent key={Math.random()}>
          <ErrorBoundary>
            <div className="main">
              <AirlineDetailsView>
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
                <AirlineContainer>
                  {/* Segment Section Start */}
                  <SegmentSection className="pr-2">
                    {/* Segment Start */}
                    {segments.Inbound
                      ? [
                          segments.Outbound.map((outbound) => (
                            <div key={Math.random()} className="segment">
                              <div className="logo-section">
                                <img
                                  alt="Airline Logo"
                                  src={outbound.segment_data.airline_logo}
                                />
                              </div>
                              <div className="takeoff-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo takeoff"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    outbound.segment_data.DepartureTime
                                  )}
                                >
                                  {utc_convert(
                                    outbound.segment_data.DepartureTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {outbound.segment_data.origin_city_name},{" "}
                                    {outbound.segment_data.Origin}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      outbound.segment_data.DepartureTime
                                    )}
                                  </h6>
                                </span>
                              </div>
                              {/* Stop Details (Desktop View) */}
                              <div className="stop-details">
                                <div className="size-12">Direct Flight</div>
                                <p className="dotted-line" />
                                <div className="flight-time">
                                  <div>
                                    Flight # {outbound.segment_data.Carrier}-
                                    {outbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      outbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              {/* Stop Details (Mobile View) */}
                              <div className="mobile-stop-details">
                                <div className="size-12">Direct Flight</div>
                                <div className="flight-time">
                                  <div>
                                    Flight # {outbound.segment_data.Carrier}-
                                    {outbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      outbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="arrive-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo arrive"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                >
                                  {utc_convert(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {`${outbound.segment_data.destination_city_name}, ${outbound.segment_data.Destination}`}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      outbound.segment_data.ArrivalTime
                                    )}
                                  </h6>
                                </span>
                              </div>
                            </div>
                          )),
                        ]
                      : segments.Outbound.map((outbound) => (
                          <div key={Math.random()} className="segment">
                            <div className="logo-section">
                              <img
                                alt="Airline Logo"
                                src={outbound.segment_data.airline_logo}
                              />
                            </div>
                            <div className="takeoff-time">
                              <img
                                alt="Airplane Logo"
                                className="airplane-logo takeoff"
                                src={Airplane}
                              />
                              <span
                                title={time_zone(
                                  outbound.segment_data.DepartureTime
                                )}
                              >
                                {utc_convert(
                                  outbound.segment_data.DepartureTime
                                )}
                              </span>
                              <h5>
                                <span>
                                  {outbound.segment_data.origin_city_name},{" "}
                                  {outbound.segment_data.Origin}
                                </span>
                              </h5>
                              <span>
                                <h6>
                                  {date_convert(
                                    outbound.segment_data.DepartureTime
                                  )}
                                </h6>
                              </span>
                            </div>
                            {/* Stop Details (Desktop View) */}
                            <div className="stop-details">
                              <div className="size-12">Direct Flight</div>
                              <p className="dotted-line" />
                              <div className="flight-time">
                                <div>
                                  Flight # {outbound.segment_data.Carrier}-
                                  {outbound.segment_data.FlightNumber}
                                </div>
                                <span>
                                  Flight Time:{" "}
                                  {time_convert(
                                    outbound.segment_data.FlightTime
                                  )}
                                </span>
                                <div>
                                  {segments.Inbound ? "Round-Trip" : ""}
                                </div>
                              </div>
                            </div>
                            {/* Stop Details (Mobile View) */}
                            <div className="mobile-stop-details">
                              <div className="size-12">Direct Flight</div>
                              <div className="flight-time">
                                <div>
                                  Flight # {outbound.segment_data.Carrier}-
                                  {outbound.segment_data.FlightNumber}
                                </div>
                                <span>
                                  Flight Time:{" "}
                                  {time_convert(
                                    outbound.segment_data.FlightTime
                                  )}
                                </span>
                                <div>
                                  {segments.Inbound ? "Round-Trip" : ""}
                                </div>
                              </div>
                            </div>
                            <div className="arrive-time">
                              <img
                                alt="Airplane Logo"
                                className="airplane-logo arrive"
                                src={Airplane}
                              />
                              <span
                                title={time_zone(
                                  outbound.segment_data.ArrivalTime
                                )}
                              >
                                {utc_convert(outbound.segment_data.ArrivalTime)}
                              </span>
                              <h5>
                                <span>
                                  {`${outbound.segment_data.destination_city_name}, ${outbound.segment_data.Destination}`}
                                </span>
                              </h5>
                              <span>
                                <h6>
                                  {date_convert(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                </h6>
                              </span>
                            </div>
                          </div>
                        ))}
                    {/* Segment End */}
                  </SegmentSection>
                  {/* Segment Section End */}
                  {/* <div className="price-section">
                    <h3>
                      {`${
                        singleFlight.price_info.pricingOverview.totalAmount
                          .currency.code
                      } ${Number(singleFlight.price)}`}
                    </h3>
                    <p>(incl.taxes & fees)</p>
                  </div> */}
                </AirlineContainer>
                <div style={{ marginTop: "12px" }}>
                  <h4
                    style={{
                      textAlign: "center",
                      marginTop: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    {" "}
                    choose your incoming Flight{" "}
                  </h4>
                  <AirlineContainer>
                    {/* Segment Section Start */}
                    <SegmentSection className="pr-2">
                      {/* Segment Start */}
                      {segments.Inbound
                        ? [
                            segments.Inbound.map((inbound) => (
                              <div key={Math.random()} className="segment">
                                <div className="logo-section">
                                  <img
                                    alt="Airline Logo"
                                    src={inbound.segment_data.airline_logo}
                                  />
                                </div>
                                <div className="takeoff-time">
                                  <img
                                    alt="Airplane Logo"
                                    className="airplane-logo takeoff"
                                    src={Airplane}
                                  />
                                  <span
                                    title={time_zone(
                                      inbound.segment_data.DepartureTime
                                    )}
                                  >
                                    {utc_convert(
                                      inbound.segment_data.DepartureTime
                                    )}
                                  </span>
                                  <h5>
                                    <span>
                                      {inbound.segment_data.origin_city_name},{" "}
                                      {inbound.segment_data.Origin}
                                    </span>
                                  </h5>
                                  <span>
                                    <h6>
                                      {date_convert(
                                        inbound.segment_data.DepartureTime
                                      )}
                                    </h6>
                                  </span>
                                </div>
                                {/* Stop Details (Desktop View) */}
                                <div className="stop-details">
                                  <div className="size-12">Direct Flight</div>
                                  <p className="dotted-line" />
                                  <div className="flight-time">
                                    <div>
                                      Flight # {inbound.segment_data.Carrier}-
                                      {inbound.segment_data.FlightNumber}
                                    </div>
                                    <span>
                                      Flight Time:{" "}
                                      {time_convert(
                                        inbound.segment_data.FlightTime
                                      )}
                                    </span>
                                    <div>
                                      {segments.Inbound ? "Round-Trip" : ""}
                                    </div>
                                  </div>
                                </div>
                                {/* Stop Details (Mobile View) */}
                                <div className="mobile-stop-details">
                                  <div className="size-12">Direct Flight</div>
                                  <div className="flight-time">
                                    <div>
                                      Flight # {inbound.segment_data.Carrier}-
                                      {inbound.segment_data.FlightNumber}
                                    </div>
                                    <span>
                                      Flight Time:{" "}
                                      {time_convert(
                                        inbound.segment_data.FlightTime
                                      )}
                                    </span>
                                    <div>
                                      {segments.Inbound ? "Round-Trip" : ""}
                                    </div>
                                  </div>
                                </div>
                                <div className="arrive-time">
                                  <img
                                    alt="Airplane Logo"
                                    className="airplane-logo arrive"
                                    src={Airplane}
                                  />
                                  <span
                                    title={time_zone(
                                      inbound.segment_data.ArrivalTime
                                    )}
                                  >
                                    {utc_convert(
                                      inbound.segment_data.ArrivalTime
                                    )}
                                  </span>
                                  <h5>
                                    <span>
                                      {`${inbound.segment_data.destination_city_name}, ${inbound.segment_data.Destination}`}
                                    </span>
                                  </h5>
                                  <span>
                                    <h6>
                                      {date_convert(
                                        inbound.segment_data.ArrivalTime
                                      )}
                                    </h6>
                                  </span>
                                </div>
                              </div>
                            )),
                          ]
                        : segments.Outbound.map((outbound) => (
                            <div key={Math.random()} className="segment">
                              <div className="logo-section">
                                <img
                                  alt="Airline Logo"
                                  src={outbound.segment_data.airline_logo}
                                />
                              </div>
                              <div className="takeoff-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo takeoff"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    outbound.segment_data.DepartureTime
                                  )}
                                >
                                  {utc_convert(
                                    outbound.segment_data.DepartureTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {outbound.segment_data.origin_city_name},{" "}
                                    {outbound.segment_data.Origin}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      outbound.segment_data.DepartureTime
                                    )}
                                  </h6>
                                </span>
                              </div>
                              {/* Stop Details (Desktop View) */}
                              <div className="stop-details">
                                <div className="size-12">Direct Flight</div>
                                <p className="dotted-line" />
                                <div className="flight-time">
                                  <div>
                                    Flight # {outbound.segment_data.Carrier}-
                                    {outbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      outbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              {/* Stop Details (Mobile View) */}
                              <div className="mobile-stop-details">
                                <div className="size-12">Direct Flight</div>
                                <div className="flight-time">
                                  <div>
                                    Flight # {outbound.segment_data.Carrier}-
                                    {outbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      outbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="arrive-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo arrive"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                >
                                  {utc_convert(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {`${outbound.segment_data.destination_city_name}, ${outbound.segment_data.Destination}`}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      outbound.segment_data.ArrivalTime
                                    )}
                                  </h6>
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
                        {`${
                          singleFlight.price_info.pricingOverview.totalAmount
                            .currency.code
                        } ${Number(singleFlight.price)}`}
                      </h3>
                      <p>(incl.taxes & fees)</p>
                    </div>
                  </AirlineContainer>
                  <div style={{ marginTop: "24px" }}>{inboundList}</div>
                </div>

                {handleSegment && (
                  <Hititsegment
                    cabin={cabin}
                    segments={segments}
                    price_info={price_info}
                    showSegments={showSegments}
                  />
                )}
              </AirlineDetailsView>
            </div>
            <DetailsViewSidebar
              queryString={queryString}
              showModal={showModal}
              singleFlight={singleFlight}
              navigateTo={navigateTo}
              layoutIst={layoutIst}
            />
          </ErrorBoundary>
        </FlightDetailsParent>
      )
    );
  } else if (layoutSecond) {
    return (
      singleFlight.segments !== null && (
        <FlightDetailsParent key={Math.random()}>
          <ErrorBoundary>
            <div className="main">
              <AirlineDetailsView>
                <AirlineContainer>
                  {/* Segment Section Start */}
                  <SegmentSection className="pr-2">
                    {/* Segment Start */}
                    {segments.Inbound
                      ? [
                          segments.Outbound.map((outbound) => (
                            <div key={Math.random()} className="segment">
                              <div className="logo-section">
                                <img
                                  alt="Airline Logo"
                                  src={outbound.segment_data.airline_logo}
                                />
                              </div>
                              <div className="takeoff-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo takeoff"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    outbound.segment_data.DepartureTime
                                  )}
                                >
                                  {utc_convert(
                                    outbound.segment_data.DepartureTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {outbound.segment_data.origin_city_name},{" "}
                                    {outbound.segment_data.Origin}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      outbound.segment_data.DepartureTime
                                    )}
                                  </h6>
                                </span>
                              </div>
                              {/* Stop Details (Desktop View) */}
                              <div className="stop-details">
                                <div className="size-12">Direct Flight</div>
                                <p className="dotted-line" />
                                <div className="flight-time">
                                  <div>
                                    Flight # {outbound.segment_data.Carrier}-
                                    {outbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      outbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              {/* Stop Details (Mobile View) */}
                              <div className="mobile-stop-details">
                                <div className="size-12">Direct Flight</div>
                                <div className="flight-time">
                                  <div>
                                    Flight # {outbound.segment_data.Carrier}-
                                    {outbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      outbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="arrive-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo arrive"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                >
                                  {utc_convert(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {`${outbound.segment_data.destination_city_name}, ${outbound.segment_data.Destination}`}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      outbound.segment_data.ArrivalTime
                                    )}
                                  </h6>
                                </span>
                              </div>
                            </div>
                          )),
                          segments.Inbound.map((inbound) => (
                            <div key={Math.random()} className="segment">
                              <div className="logo-section">
                                <img
                                  alt="Airline Logo"
                                  src={inbound.segment_data.airline_logo}
                                />
                              </div>
                              <div className="takeoff-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo takeoff"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    inbound.segment_data.DepartureTime
                                  )}
                                >
                                  {utc_convert(
                                    inbound.segment_data.DepartureTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {inbound.segment_data.origin_city_name},{" "}
                                    {inbound.segment_data.Origin}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      inbound.segment_data.DepartureTime
                                    )}
                                  </h6>
                                </span>
                              </div>
                              {/* Stop Details (Desktop View) */}
                              <div className="stop-details">
                                <div className="size-12">Direct Flight</div>
                                <p className="dotted-line" />
                                <div className="flight-time">
                                  <div>
                                    Flight # {inbound.segment_data.Carrier}-
                                    {inbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      inbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              {/* Stop Details (Mobile View) */}
                              <div className="mobile-stop-details">
                                <div className="size-12">Direct Flight</div>
                                <div className="flight-time">
                                  <div>
                                    Flight # {inbound.segment_data.Carrier}-
                                    {inbound.segment_data.FlightNumber}
                                  </div>
                                  <span>
                                    Flight Time:{" "}
                                    {time_convert(
                                      inbound.segment_data.FlightTime
                                    )}
                                  </span>
                                  <div>
                                    {segments.Inbound ? "Round-Trip" : ""}
                                  </div>
                                </div>
                              </div>
                              <div className="arrive-time">
                                <img
                                  alt="Airplane Logo"
                                  className="airplane-logo arrive"
                                  src={Airplane}
                                />
                                <span
                                  title={time_zone(
                                    inbound.segment_data.ArrivalTime
                                  )}
                                >
                                  {utc_convert(
                                    inbound.segment_data.ArrivalTime
                                  )}
                                </span>
                                <h5>
                                  <span>
                                    {`${inbound.segment_data.destination_city_name}, ${inbound.segment_data.Destination}`}
                                  </span>
                                </h5>
                                <span>
                                  <h6>
                                    {date_convert(
                                      inbound.segment_data.ArrivalTime
                                    )}
                                  </h6>
                                </span>
                              </div>
                            </div>
                          )),
                        ]
                      : segments.Outbound.map((outbound) => (
                          <div key={Math.random()} className="segment">
                            <div className="logo-section">
                              <img
                                alt="Airline Logo"
                                src={outbound.segment_data.airline_logo}
                              />
                            </div>
                            <div className="takeoff-time">
                              <img
                                alt="Airplane Logo"
                                className="airplane-logo takeoff"
                                src={Airplane}
                              />
                              <span
                                title={time_zone(
                                  outbound.segment_data.DepartureTime
                                )}
                              >
                                {utc_convert(
                                  outbound.segment_data.DepartureTime
                                )}
                              </span>
                              <h5>
                                <span>
                                  {outbound.segment_data.origin_city_name},{" "}
                                  {outbound.segment_data.Origin}
                                </span>
                              </h5>
                              <span>
                                <h6>
                                  {date_convert(
                                    outbound.segment_data.DepartureTime
                                  )}
                                </h6>
                              </span>
                            </div>
                            {/* Stop Details (Desktop View) */}
                            <div className="stop-details">
                              <div className="size-12">Direct Flight</div>
                              <p className="dotted-line" />
                              <div className="flight-time">
                                <div>
                                  Flight # {outbound.segment_data.Carrier}-
                                  {outbound.segment_data.FlightNumber}
                                </div>
                                <span>
                                  Flight Time:{" "}
                                  {time_convert(
                                    outbound.segment_data.FlightTime
                                  )}
                                </span>
                                <div>
                                  {segments.Inbound ? "Round-Trip" : ""}
                                </div>
                              </div>
                            </div>
                            {/* Stop Details (Mobile View) */}
                            <div className="mobile-stop-details">
                              <div className="size-12">Direct Flight</div>
                              <div className="flight-time">
                                <div>
                                  Flight # {outbound.segment_data.Carrier}-
                                  {outbound.segment_data.FlightNumber}
                                </div>
                                <span>
                                  Flight Time:{" "}
                                  {time_convert(
                                    outbound.segment_data.FlightTime
                                  )}
                                </span>
                                <div>
                                  {segments.Inbound ? "Round-Trip" : ""}
                                </div>
                              </div>
                            </div>
                            <div className="arrive-time">
                              <img
                                alt="Airplane Logo"
                                className="airplane-logo arrive"
                                src={Airplane}
                              />
                              <span
                                title={time_zone(
                                  outbound.segment_data.ArrivalTime
                                )}
                              >
                                {utc_convert(outbound.segment_data.ArrivalTime)}
                              </span>
                              <h5>
                                <span>
                                  {`${outbound.segment_data.destination_city_name}, ${outbound.segment_data.Destination}`}
                                </span>
                              </h5>
                              <span>
                                <h6>
                                  {date_convert(
                                    outbound.segment_data.ArrivalTime
                                  )}
                                </h6>
                              </span>
                            </div>
                          </div>
                        ))}
                    {/* Segment End */}
                  </SegmentSection>
                  {/* Segment Section End */}
                  <div className="price-section">
                    <h3>
                      {`${
                        singleFlight.price_info.pricingOverview.totalAmount
                          .currency.code
                      } ${Number(singleFlight.price)}`}
                    </h3>
                    <p>(incl.taxes & fees)</p>
                  </div>
                </AirlineContainer>
                <Hititsegment
                  cabin={cabin}
                  segments={segments}
                  price_info={price_info}
                  showSegments={showSegments}
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
      )
    );
  } else if (layoutThird) {
    return (
      selectedNewFlight.segments !== null && (
        <FlightDetailsParent key={Math.random()}>
          <ErrorBoundary>
            <div className="main">
              <AirlineDetailsView>
                <AirlineContainer>
                  {/* Segment Section Start */}
                  <SegmentSection className="pr-2">
                    {/* Segment Start */}
                    {selectedNewFlight.segments.Inbound
                      ? [
                          selectedNewFlight.segments.Outbound.map(
                            (outbound) => (
                              <div key={Math.random()} className="segment">
                                <div className="logo-section">
                                  <img
                                    alt="Airline Logo"
                                    src={outbound.segment_data.airline_logo}
                                  />
                                </div>
                                <div className="takeoff-time">
                                  <img
                                    alt="Airplane Logo"
                                    className="airplane-logo takeoff"
                                    src={Airplane}
                                  />
                                  <span
                                    title={time_zone(
                                      outbound.segment_data.DepartureTime
                                    )}
                                  >
                                    {utc_convert(
                                      outbound.segment_data.DepartureTime
                                    )}
                                  </span>
                                  <h5>
                                    <span>
                                      {outbound.segment_data.origin_city_name},{" "}
                                      {outbound.segment_data.Origin}
                                    </span>
                                  </h5>
                                  <span>
                                    <h6>
                                      {date_convert(
                                        outbound.segment_data.DepartureTime
                                      )}
                                    </h6>
                                  </span>
                                </div>
                                {/* Stop Details (Desktop View) */}
                                <div className="stop-details">
                                  <div className="size-12">Direct Flight</div>
                                  <p className="dotted-line" />
                                  <div className="flight-time">
                                    <div>
                                      Flight # {outbound.segment_data.Carrier}-
                                      {outbound.segment_data.FlightNumber}
                                    </div>
                                    <span>
                                      Flight Time:{" "}
                                      {time_convert(
                                        outbound.segment_data.FlightTime
                                      )}
                                    </span>
                                    <div>
                                      {segments.Inbound ? "Round-Trip" : ""}
                                    </div>
                                  </div>
                                </div>
                                {/* Stop Details (Mobile View) */}
                                <div className="mobile-stop-details">
                                  <div className="size-12">Direct Flight</div>
                                  <div className="flight-time">
                                    <div>
                                      Flight # {outbound.segment_data.Carrier}-
                                      {outbound.segment_data.FlightNumber}
                                    </div>
                                    <span>
                                      Flight Time:{" "}
                                      {time_convert(
                                        outbound.segment_data.FlightTime
                                      )}
                                    </span>
                                    <div>
                                      {segments.Inbound ? "Round-Trip" : ""}
                                    </div>
                                  </div>
                                </div>
                                <div className="arrive-time">
                                  <img
                                    alt="Airplane Logo"
                                    className="airplane-logo arrive"
                                    src={Airplane}
                                  />
                                  <span
                                    title={time_zone(
                                      outbound.segment_data.ArrivalTime
                                    )}
                                  >
                                    {utc_convert(
                                      outbound.segment_data.ArrivalTime
                                    )}
                                  </span>
                                  <h5>
                                    <span>
                                      {`${outbound.segment_data.destination_city_name}, ${outbound.segment_data.Destination}`}
                                    </span>
                                  </h5>
                                  <span>
                                    <h6>
                                      {date_convert(
                                        outbound.segment_data.ArrivalTime
                                      )}
                                    </h6>
                                  </span>
                                </div>
                              </div>
                            )
                          ),
                          selectedNewFlight?.segments.Inbound?.map(
                            (inbound) => (
                              <div key={Math.random()} className="segment">
                                <div className="logo-section">
                                  <img
                                    alt="Airline Logo"
                                    src={inbound.segment_data.airline_logo}
                                  />
                                </div>
                                <div className="takeoff-time">
                                  <img
                                    alt="Airplane Logo"
                                    className="airplane-logo takeoff"
                                    src={Airplane}
                                  />
                                  <span
                                    title={time_zone(
                                      inbound.segment_data.DepartureTime
                                    )}
                                  >
                                    {utc_convert(
                                      inbound.segment_data.DepartureTime
                                    )}
                                  </span>
                                  <h5>
                                    <span>
                                      {inbound.segment_data.origin_city_name},{" "}
                                      {inbound.segment_data.Origin}
                                    </span>
                                  </h5>
                                  <span>
                                    <h6>
                                      {date_convert(
                                        inbound.segment_data.DepartureTime
                                      )}
                                    </h6>
                                  </span>
                                </div>
                                {/* Stop Details (Desktop View) */}
                                <div className="stop-details">
                                  <div className="size-12">Direct Flight</div>
                                  <p className="dotted-line" />
                                  <div className="flight-time">
                                    <div>
                                      Flight # {inbound.segment_data.Carrier}-
                                      {inbound.segment_data.FlightNumber}
                                    </div>
                                    <span>
                                      Flight Time:{" "}
                                      {time_convert(
                                        inbound.segment_data.FlightTime
                                      )}
                                    </span>
                                    <div>
                                      {segments.Inbound ? "Round-Trip" : ""}
                                    </div>
                                  </div>
                                </div>
                                {/* Stop Details (Mobile View) */}
                                <div className="mobile-stop-details">
                                  <div className="size-12">Direct Flight</div>
                                  <div className="flight-time">
                                    <div>
                                      Flight # {inbound.segment_data.Carrier}-
                                      {inbound.segment_data.FlightNumber}
                                    </div>
                                    <span>
                                      Flight Time:{" "}
                                      {time_convert(
                                        inbound.segment_data.FlightTime
                                      )}
                                    </span>
                                    <div>
                                      {segments.Inbound ? "Round-Trip" : ""}
                                    </div>
                                  </div>
                                </div>
                                <div className="arrive-time">
                                  <img
                                    alt="Airplane Logo"
                                    className="airplane-logo arrive"
                                    src={Airplane}
                                  />
                                  <span
                                    title={time_zone(
                                      inbound.segment_data.ArrivalTime
                                    )}
                                  >
                                    {utc_convert(
                                      inbound.segment_data.ArrivalTime
                                    )}
                                  </span>
                                  <h5>
                                    <span>
                                      {`${inbound.segment_data.destination_city_name}, ${inbound.segment_data.Destination}`}
                                    </span>
                                  </h5>
                                  <span>
                                    <h6>
                                      {date_convert(
                                        inbound.segment_data.ArrivalTime
                                      )}
                                    </h6>
                                  </span>
                                </div>
                              </div>
                            )
                          ),
                        ]
                      : ""}
                    {/* Segment End */}
                  </SegmentSection>
                  {/* Segment Section End */}
                  <div className="price-section">
                    <h3>
                      {`${
                        selectedNewFlight.price_info.pricingOverview.totalAmount
                          .currency.code
                      } ${Number(selectedNewFlight.price)}`}
                    </h3>

                    <p>(incl.taxes & fees)</p>
                  </div>
                </AirlineContainer>
                <Hititsegment
                  cabin={cabin}
                  segments={selectedNewFlight.segments}
                  price_info={selectedNewFlight.price_info}
                  showSegments={showSegments}
                />
              </AirlineDetailsView>
            </div>
            <DetailsViewSidebar
              queryString={queryString}
              showModal={showModal}
              singleFlight={
                selectedNewFlight ? selectedNewFlight : singleFlight
              }
              navigateTo={navigateTo}
            />
          </ErrorBoundary>
        </FlightDetailsParent>
      )
    );
  }
};

export default HititDetailsView;
