import React, { useState, useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectNewBookingForm from './selectors';
import { hotelsSearchRequest } from './actions';
import reducer from './reducer';
import saga from './saga';
import { ThreeDots } from 'react-loader-spinner';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { HotelForm } from './wrapper/NewBookingFormStyle';
import ErrorBoundary from '../../helper/ErrorBoundary';
import Select from 'react-select'; 

const Hotel = ({ regions, sectors, loader, regionChange, regionVal, sectorChange, checkInDate, setCheckInDate, checkOutDate, setCheckOutDate, sectorVal, hotelsSearchRequest }) => {

    useInjectReducer({ key: 'newBookingForm', reducer });
    useInjectSaga({ key: 'newBookingForm', saga });

    const isMounted = useRef();
    const history = useNavigate();
    const [submitHotel, setSubmitHotel] = useState(false);
    const [sectorArr, setSectorArr] = useState([]);
    const [cities, setCities] = useState([]);
    
    let countries = [];
    let defaultCountry = {};
    if(regions && regions.length > 0)
    {
        regions.map((region)=>{
            if(region.region_name === 'Pakistan')
            {
                defaultCountry = { value: region.id, label: region.region_name };
            }
            return countries.push({ value: region.id, label: region.region_name });
        })
    }

    const handleSubmit = event => {
        event.preventDefault();
        if (regionVal > 0 && sectorVal > 0 && checkInDate !== undefined && checkOutDate !== undefined) {
            setSubmitHotel(true);
        }
    }

    const initialize = () => {
        if (sectors && sectors.length > 0)
        {
            let sectorList = [];
            let cityList = [];
            sectorList = sectors.map((sector) => {
                if (regionVal > 0) {
                    if (Number(sector.region_id) === regionVal)
                    {
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

            sectorList = sectorList.filter(Boolean);

            sectorList.map((sector)=>{
                return cityList.push({ value: sector.sector_id, label: sector.sector_name });
            })

            setSectorArr(sectorList);
            setCities(cityList);
        }
    }
    
    const searchObj = useCallback(() => {
        if (sectors && sectors.length > 0)
        {
            let sectorList = [];
            let cityList = [];
            sectorList = sectors.map((sector) => {
                if (regionVal > 0) {
                    if (Number(sector.region_id) === regionVal)
                    {
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

            sectorList = sectorList.filter(Boolean);

            sectorList.map((sector)=>{
                return cityList.push({ value: sector.sector_id, label: sector.sector_name });
            })

            setSectorArr(sectorList);
            setCities(cityList);
        }
        let sName = [];
        sName = sectorArr.map((sector) => {
            if (Number(sector.sector_id) === sectorVal)
            {
                return sector.sector_name;
            }
            else
            {
                return '';
            }
        })
        sName = sName.filter(Boolean);

        return {
            sector: sectorVal,
            checkin: checkInDate.toString(),
            checkout: checkOutDate.toString(),
            sector_name: sName[0],
            locations: { 
                countries: regions,
                cities: sectors,
            }
        }
    }, [sectorArr, regionVal, sectorVal, checkInDate, checkOutDate, regions, sectors]);

    useEffect(() => {
        if (submitHotel)
        {
            let obj = searchObj();
            try
            {
                hotelsSearchRequest(obj);
            }
            catch (error) { }
            history({
                pathname: `/hotels-list/sector=${obj.sector}&checkin=${checkInDate}&checkout=${checkOutDate}&sector_name=${obj.sector_name}`
            })
        }
        // return '';
    }, [hotelsSearchRequest, searchObj, history, checkInDate, checkOutDate, submitHotel])

    useEffect(()=>{
        if(isMounted.current)
        {
            return;
        }

        initialize();

        isMounted.current = true;
    }, [isMounted]);

    return (
        <ErrorBoundary>
            <HotelForm>
                {
                    (loader) ?
                        <div className='loader-div'>
                            <ThreeDots color="#378edd" />
                        </div>
                    :
                        <div className='pt-3 px-3'>
                            {
                                (countries && countries.length > 0) &&
                                <div className="row d-flex flex-row Dates-Fields-Row justify-content-center">
                                    <div className='col-md-12 text-left'>
                                        <div className="form date Flight-Class">
                                            <div className="inputs-filed mt-10">
                                                <label htmlFor="region">Country</label>
                                                <div className="region-sector-select">
                                                    <Select 
                                                        name="region"
                                                        placeholder={'Select Country'}
                                                        className = {'region-select'}
                                                        classNamePrefix = {'react-select'}
                                                        isSearchable  = {true}
                                                        options={countries}
                                                        onChange={(e)=>{regionChange(e)}}
                                                        defaultValue = { defaultCountry }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                (sectorArr && sectorArr.length > 0) &&
                                <div className="row d-flex flex-row Dates-Fields-Row justify-content-center">
                                    <div className='col-md-12 text-left'>
                                        <div className="form date Flight-Class">
                                            <div className="inputs-filed mt-10">
                                                <label htmlFor="sector">City</label>
                                                <div className="region-sector-select">
                                                    <Select 
                                                        name="sector"
                                                        placeholder={'Select City'}
                                                        className = {'sector-select'}
                                                        classNamePrefix = {'react-select'}
                                                        isSearchable  = {true}
                                                        options={cities}
                                                        onChange={(e)=>{sectorChange(e)}}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="row d-flex flex-row Dates-Fields-Row justify-content-center">
                                <div className='col-md-12'>
                                    <div className="form date Departure-Date">
                                        <div className="inputs-filed mt-10 date d-flex flex-column">
                                            <i className="fal fa-calendar-alt position-absolute calender-icon" />
                                            <label htmlFor="checkin">Check-In</label>
                                            <DatePicker
                                                name="checkin"
                                                id="checkin"
                                                autoComplete="off"
                                                dateFormat="dd-MM-yyyy"
                                                selected={checkInDate}
                                                onChange={date => setCheckInDate(date)}
                                                minDate={new Date()}
                                                placeholderText="Check-In Date"
                                                showDisabledMonthNavigation
                                                selectsStart
                                                startDate={checkInDate}
                                                endDate={checkOutDate}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex flex-row Dates-Fields-Row justify-content-center">
                                <div className='col-md-12'>
                                    <div className="form date Departure-Date">
                                        <div className="inputs-filed mt-10 date d-flex flex-column">
                                            <i className="fal fa-calendar-alt position-absolute calender-icon" />
                                            <label htmlFor="checkout">Check-Out</label>
                                            <DatePicker
                                                name="checkout"
                                                id="checkout"
                                                autoComplete="off"
                                                dateFormat="dd-MM-yyyy"
                                                selected={checkOutDate}
                                                onChange={date => setCheckOutDate(date)}
                                                placeholderText="Check-Out Date"
                                                showDisabledMonthNavigation
                                                selectsEnd
                                                startDate={checkInDate}
                                                endDate={checkOutDate}
                                                minDate={checkInDate}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <div className="inputs-filed mt-30">
                                    <button
                                        type="submit"
                                        id="submit"
                                        className="main-btn btn-filled get-hotels-button"
                                        onClick={handleSubmit}
                                        disabled={(
                                            (regionVal === 0 || isNaN(regionVal)) ||
                                            (sectorVal === 0 || isNaN(sectorVal)) ||
                                            (checkInDate === undefined || checkInDate === null) ||
                                            (checkOutDate === undefined || checkOutDate === null)) ? true : false}
                                    >Search Now</button>
                                </div>
                            </div>
                        </div>
                }
            </HotelForm>
        </ErrorBoundary>
    );
};

const mapStateToProps = createStructuredSelector({
    newBookingForm: makeSelectNewBookingForm(),
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        { hotelsSearchRequest },
        dispatch,
    );
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

export default compose(withConnect)(Hotel);