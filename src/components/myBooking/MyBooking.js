import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import Navigation from "../Navigation";
import Axios from "../../utils/service";
import { date_convert } from "../../helper/ConvertFunctions";
import ViewBooking from "../BookingModal/ViewBooking";
import { useNavigate } from "react-router-dom";
import { PaymentConfirmation } from "../../containers/FlightList/PaymentConfirmation";
const MyBooking = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showViewBookingModal, setViewBookingModal] = useState(false);
  const [flightData, setFlightData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    let userId = 0;
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      userId = user.userId;
    }
    const API_URL = "api/get-bookings-by-userid?user_id=" + userId;

    const fetchData = async () => {
      const result = await Axios(API_URL);
      setLoading(false);
      if (result.data.status !== "200") {
      } else {
        setData(result.data.data);
      }
    };

    fetchData();
  }, []);

  const handleShow = (data) => {
    let pnr = data.pnr;
    let lastName = data.booking_detail[0].l_name;
    let navUrl =
      "/get-flight-booking/pnr=" + pnr + "&last_name=" + lastName + "&pre=400";
    navigate(navUrl);

    // setViewBookingModal(!showViewBookingModal);
    // handleData(data);
  };

  const handleData = (booking) => {
    setFlightData(booking);
  };
  if (loading) return <div>Loading...</div>;
  return (
    <div className="">
      <Navigation />

      <div
        style={{ marginTop: "100px" }}
        className="table-responsive container bg-white mb-5 "
      >
        <table style={{ fontSize: "13px" }} className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Phone Number</th>

              <th scope="col">Airline Name</th>

              <th scope="col">PNR</th>
              <th scope="col">Booking Date</th>
              <th scope="col">Booking Status</th>
              <th scope="col">Total Amount</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => {
                let airlineName = "";
                if (row.api_type === "airsial") {
                  airlineName = "airsial";
                } else {
                  if (row.booking_response.segments[0].airline_name !== null) {
                    airlineName = row.booking_response.segments[0].airline_name;
                  } else {
                    airlineName = "not found";
                  }
                }

                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <tr hover tabIndex={-1} key={row.id}>
                    <td component="th" id={labelId} scope="row">
                      {index + 1}
                    </td>
                    <td align="left">
                      {row.booking_detail[0].f_name +
                        " " +
                        row.booking_detail[0].l_name}
                    </td>
                    <td align="left">{row.phone_number}</td>
                    <td align="left">{airlineName}</td>
                    <td align="left">{row.pnr}</td>
                    <td align="left">{date_convert(row.created_at)}</td>

                    <td align="left">
                      <span
                        className={
                          row.booking_status === "Completed"
                            ? "badge badge-success"
                            : row.booking_status === "Incompleted"
                            ? "badge badge-warning"
                            : "badge badge-danger"
                        }
                      >
                        {row.booking_status}
                      </span>
                    </td>
                    <td align="left">{row.total_amount_with_commission}</td>

                    {/* <td align="left">{row.last_date}</td> */}
                    {/* <td align="left">
                        {InnerRightsFilter("flight-cancellation", userData) &&
                          cancelBtn(row)}
                      </td> */}
                    {/* <td align="left">
                    {row.user_data !== undefined && row.user_data !== null
                      ? row.user_data.first_name + " " + row.user_data.last_name
                      : ""}
                  </td> */}
                    <td>
                      <i
                        className="fas fa-eye cursor-pointer mr-2"
                        title="View Booking"
                        onClick={() => handleShow(row)}
                      />
                    </td>
                    {/* <td align="left" className="px-2">
                    {InnerRightsFilter("flight-cancellation", userData) &&
                      cancelBtn(row)}
                    <i
                      className="fas fa-eye cursor-pointer mr-2"
                      title="View Booking"
                      onClick={() => handleShow(row.action)}
                    />
                    {row.booking_status === "Incompleted" &&
                      row.payment === "Pending" &&
                      InnerRightsFilter("flight-confirmation", userData) && (
                        <i
                          className="far fa-credit-card cursor-pointer"
                          title="Confirm Payment & Issue Ticket"
                          onClick={() => handlePaymentShow(row.action)}
                        />
                      )}
                  </td> */}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                  className="text-center"
                  colSpan={10}
                >
                  No Booking Yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showViewBookingModal && (
          <ViewBooking
            showModal={showViewBookingModal}
            handleShow={handleShow}
            booking={flightData}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBooking;
