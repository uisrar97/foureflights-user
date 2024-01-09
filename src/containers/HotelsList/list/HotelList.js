import React from 'react';
import ErrorBoundary from '../../../helper/ErrorBoundary';
import Hotel from './Hotel';

export default function HotelList ({hotelList, cities, selectedRatings, selectedAreas, selectedVendorTypes, selectedRefundTypes})
{
    let selectedRating = [];
    let selectedArea = [];
    let selectedVendorType = [];
    let selectedRefundType = [];
    let hotels = [];
    
    if (hotelList.status === '200' && hotelList.data && hotelList.data.length > 0)
    {
        hotels = hotelList.data;
    }

    for(const element in selectedRatings)
    {
        if(selectedRatings[element] === true)
        {
            selectedRating.push(element);
        }
    }
    for(const element in selectedAreas)
    {
        if(selectedAreas[element] === true)
        {
            selectedArea.push(Number(element));
        }
    }
    for(const element in selectedVendorTypes)
    {
        if(selectedVendorTypes[element] === true)
        {
            selectedVendorType.push(element);
        }
    }
    for(const element in selectedRefundTypes)
    {
        if(selectedRefundTypes[element] === true)
        {
            selectedRefundType.push(element);
        }
    }

    if(selectedRating.length > 0)
    {
        hotels = hotels.map((hotel)=>{
            if(selectedRating.includes(`${hotel.rating}`))
            {
                return hotel;
            }
            else
            {
                return '';
            }
        });
        hotels = hotels.filter(Boolean);
    }
    if(selectedArea.length > 0)
    {
        hotels = hotels.map((hotel)=>{
            if(selectedArea.includes(Number(hotel.area_id)))
            {
                return hotel;
            }
            else
            {
                return '';
            }
        })
        hotels = hotels.filter(Boolean);
    }
    if(selectedVendorType.length > 0)
    {
        hotels = hotels.map((hotel)=>{
            if(selectedVendorType.includes(hotel.vendor_type))
            {
                return hotel;
            }
            else
            {
                return '';
            }
        })
        hotels = hotels.filter(Boolean);
    }
    if(selectedRefundType.length > 0)
    {
        hotels = hotels.map((hotel)=>{
            if(selectedRefundType.includes(hotel.refundable))
            {
                return hotel;
            }
            else
            {
                return '';
            }
        })
        hotels = hotels.filter(Boolean);
    }
    
    return (
        <div className='hotel-list'>
            <ErrorBoundary>
                {
                    (hotels && hotels.length > 0) ?
                        hotels.map((hotel, index)=>{
                            return (
                                <Hotel hotel={hotel} key={index} cities={cities} />
                            );
                        })
                    :
                        <div className='w-100 text-center not-found'>
                            <span style={{ color: '#fcb040', fontSize: '30px' }}>No Result Found.</span>
                        </div>
                }
            </ErrorBoundary>
        </div>
    );
}