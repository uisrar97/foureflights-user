import React, {useState, useEffect, useCallback} from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ErrorBoundary from '../../helper/ErrorBoundary';
import { useNavigate } from 'react-router-dom';
import { ModifyHotelSearchMain, ModifyHotelSearchFormMain } from './wrapper/HotelListStyle';
import { date_convert } from '../../helper/ConvertFunctions';
const ModifyHotelSearch = ({ query, hotelSearch, setModify, details }) =>
{
    // const isMounted = useRef();
    const history = useNavigate();
    const [modifySearch, setModifySearch] = useState(false);
    const [initialize, setInitialize] = useState(true);
    const [sectorVal, setSectorVal] = useState(Number(0));
    const [regional, setRegionVal] = useState(Number(0));
    const [sectName, setSectName] = useState('');

    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');

    const initializeData = useCallback(() => {
        setInitialize(false);
        setSectorVal(query.sector);
        setSectName(query.sName);
        setCheckInDate(new Date(query.checkin));
        setCheckOutDate(new Date(query.checkout));
    }, [query]);

    
    let regions = hotelSearch.locations.countries;
    let sectors = hotelSearch.locations.cities;
    let regionVal = 0;
    let sectorArr = [];
    let countries = [];
    let cities = [];
    let selectedCountry = {};
    let selectedCity = {};
    if(regions && regions.length > 0)
    {
        regions.map((region)=>{
            return countries.push({ value: region.id, label: region.region_name });
        })
    }
    if (sectors && sectors.length > 0) {
        sectorArr = sectors.map((sector) => {
            return sector;
        });
        regionVal = sectorArr.filter(sector => Number(sector.sector_id) === hotelSearch.sector)
        regionVal = regionVal[0].region_id;
        sectorArr = sectors.map((sector) => {
            if (regionVal > 0) {
                if (Number(sector.region_id) === regionVal) {
                    return sector;
                }
                else
                {
                    return '';
                }
            }
            else
            {
                return '';
            }
        });
        sectorArr = sectorArr.filter(Boolean);
        sectorArr.map((sector)=>{
            return cities.push({ value: sector.sector_id, label: sector.sector_name });
        })
        selectedCountry = countries.filter(country => country.value === regionVal);
        selectedCity = cities.filter(city => city.value === Number(query.sector));
    }
    const dispModify = () => {
        setModifySearch(!modifySearch);
    }
    const regionChange = (event) => {
        // Apply Cities Array filter on Country Select
        setRegionVal(Number(event.value));
    };
    const sectorChange = (event) => {
        setSectorVal(Number(event.value));
        setSectName(event.label);
    };
    useEffect(() => {
        // if(isMounted.current)
        // {
        //     return;
        // }
        if(modifySearch && initialize)
        {
            initializeData();
        }

        // isMounted.current = true;
      }, [modifySearch, initialize, initializeData]);
    return (
        <ErrorBoundary>
            <ModifyHotelSearchMain className='row'>
                <div className='back-btn justify-content-center'>
                    <i onClick={()=>{history.goBack()}} className="fas fa-arrow-alt-left btn btn-primary rounded-circle m-auto" style={{fontSize: '25px'}}/>
                </div>
                <div className={(details) ? 'from-to-hotel-details' : 'from-to-details'}>
                    <h3 className='my-auto'>City: <span>{query.sName}</span></h3>
                    <h3 className='my-auto'>Check-In Date: <span>{date_convert(query.checkin)}</span></h3>
                    <h3 className='my-auto'>Check-Out Date: <span>{date_convert(query.checkout)}</span></h3>
                </div>
                {
                    (!details) &&
                        <div className='mod-btn text-center'>
                            <button onClick={()=>{dispModify()}}>Modify Search</button>
                        </div>
                }
            </ModifyHotelSearchMain>
            {
                (modifySearch) &&
                    <ModifyHotelSearchFormMain>
                        <div className='col-md-12 row'>
                            <div className='col-md-3'>
                                <label htmlFor="country">Country</label>
                                <div className="region-sector-select">
                                    <Select
                                        name="country"
                                        placeholder={'Select Country'}
                                        className = {'region-select'}
                                        classNamePrefix = {'react-select'}
                                        isSearchable  = { true }
                                        options={ countries }
                                        onChange={(e)=>{regionChange(e)}}
                                        defaultValue = { selectedCountry }
                                    />
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <label htmlFor="city">City</label>
                                <div className="region-sector-select">
                                    <Select
                                        name="city"
                                        placeholder={'Select City'}
                                        className = {'region-select'}
                                        classNamePrefix = {'react-select'}
                                        isSearchable  = { true }
                                        options={ cities }
                                        onChange={(e)=>{sectorChange(e)}}
                                        defaultValue = { selectedCity }
                                    />
                                </div>
                            </div>
                            <div className='col-md-3'>
                                <i className="fal fa-calendar-alt position-absolute calender-icon" />
                                <label htmlFor="checkin">Check-In</label>
                                <DatePicker
                                    name="checkin"
                                    id="checkin"
                                    autoComplete="off"
                                    dateFormat="dd-MM-yyyy"
                                    startDate={checkInDate}
                                    endDate={checkOutDate}
                                    minDate={new Date()}
                                    selected={checkInDate}
                                    placeholderText="Check-In Date"
                                    onChange={date => {setCheckInDate(date)}}
                                    showDisabledMonthNavigation
                                    selectsStart
                                />
                            </div>
                            <div className='col-md-3'>
                                <i className="fal fa-calendar-alt position-absolute calender-icon" />
                                <label htmlFor="checkout">Check-Out</label>
                                <DatePicker
                                    name="checkout"
                                    id="checkout"
                                    autoComplete="off"
                                    dateFormat="dd-MM-yyyy"
                                    startDate={checkInDate}
                                    endDate={checkOutDate}
                                    minDate={checkInDate}
                                    selected={checkOutDate}
                                    placeholderText="Check-Out Date"
                                    onChange={date => {setCheckOutDate(date)}}
                                    showDisabledMonthNavigation
                                    selectsStart
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-md-12 text-center">
                                <div className="inputs-filed mt-30">
                                    <button
                                        type="submit"
                                        className="main-btn btn-filled booking-form-button"
                                        onClick={()=>{
                                            setModify(true);
                                            history({
                                                pathname: `/hotels-list/sector=${sectorVal}&checkin=${checkInDate}&checkout=${checkOutDate}&sector_name=${sectName}`
                                            });
                                        }}
                                    >Search Now</button>
                                </div>
                            </div>
                        </div>
                    </ModifyHotelSearchFormMain>
            }
        </ErrorBoundary>
    );
}
export default ModifyHotelSearch;