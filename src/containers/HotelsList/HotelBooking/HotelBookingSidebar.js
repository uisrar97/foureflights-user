import React from 'react';
import ErrorBoundary from '../../../helper/ErrorBoundary';
import { SidebarTravellerDetails } from '../wrapper/HotelListStyle';
import { days_between, date_convert } from '../../../helper/ConvertFunctions';
export function HotelBookingSidebar({ rooms, search, hotel })
{
  const totalDays = days_between(new Date(search.checkin).setHours(0, 0, 0, 0), new Date(search.checkout).setHours(0, 0, 0, 0));
  return (
    <SidebarTravellerDetails>
      <ErrorBoundary>
        <div className="additional-info"  >
          <h3>Your Booking</h3>
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5"><p>Hotel: </p></div>
                <div className="col-7"><span className="address">{hotel}</span></div>
              </div>
            </div>
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5"><p>City: </p></div>
                <div className="col-7"><span className="address">{search.sName}</span></div>
              </div>
            </div>
          </div>
          <hr className="mt-0" />
          <h3>Search Query</h3>
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5"><p>Check-In Date: </p></div>
                <div className="col-7"><span className="address">{date_convert(search.checkin)}</span></div>
              </div>
            </div>
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5"><p>Check-Out Date: </p></div>
                <div className="col-7"><span className="address">{date_convert(search.checkout)}</span></div>
              </div>
            </div>
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5"><p>Total Days: </p></div>
                <div className="col-7"><span className="address">{totalDays}</span></div>
              </div>
            </div>
          </div>
          <hr className="mt-0" />
          <h3>Selected Rooms</h3>
          <div className="add-sec">
            {
              rooms.selectedRoom.map((room, index) => {
                return (
                  <div className="location mb-2" key={index}>
                    <div className="loc-inner row mb-2">
                      <div className="col-5"><p>Room Name: </p></div>
                      <div className="col-7"><span className="flight-info"><p>{room.title}</p></span></div>
                    </div>
                    <div className="loc-inner row mb-2">
                      <div className="col-5"><p>Price Per Night: </p></div>
                      <div className="col-7"><span className="flight-info"><p>{`PKR ${room.price}`}</p></span></div>
                    </div>
                    <div className="loc-inner row mb-2">
                      <div className="col-5"><p>No. of Rooms: </p></div>
                      <div className="col-7"><span className="flight-info"><p>{room.qty}</p></span></div>
                    </div>
                    {
                      (rooms.selectedRoom.length > 1 && index + 1 !== rooms.selectedRoom.length) &&
                      <hr />
                    }
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="additional-info">
          <h3>Summary</h3>
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5"><p>Four-E Hotels </p></div>
                <div className="col-7"><span className="address">{'PKR ' + rooms.totalPrice}</span></div>
              </div>
            </div>
          </div>
          <hr className="mt-0" />
          <div className="add-sec">
            <div className="location">
              <div className="loc-inner row">
                <div className="col-5"><p>Price You Pay </p></div>
                <div className="col-7"><span className="address">{'PKR ' + rooms.totalPrice}</span></div>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </SidebarTravellerDetails>
  );
}

export default HotelBookingSidebar;