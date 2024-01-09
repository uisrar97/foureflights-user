import React, {useState} from 'react';
import ErrorBoundary from '../../helper/ErrorBoundary';
import RatingsFilter from './SidebarFilters/RatingsFilter';
import AreaFilter from './SidebarFilters/AreaFilter';
import VendorTypeFilter from './SidebarFilters/VendorTypeFilter';
import RefundFilter from './SidebarFilters/RefundFilter';
import SearchResult from '../../helper/sidebarBtns/SearchResult';

export default function HotelSidebar({hotelList, areaList, sectorId, vendorTypes, refundTypes, handleRatingChange, handleAreasChange, 
    handleVendorTypeChange, handleRefundChange})
{
    const [ratingSection, setRatingSection] = useState(true);
    const [areaSection, setAreaSection] = useState(true);
    const [vendorTypeSection, setVendorTypeSection] = useState(true);
    const [refundableSection, setRefundableSection] = useState(true);

    const showRatingToggle = () => {
        setRatingSection(!ratingSection);
    }

    const showAreaToggle = () => {
        setAreaSection(!areaSection);
    }

    const showVendorTypeToggle = () => {
        setVendorTypeSection(!vendorTypeSection);
    }

    const showRefundToggle = () => {
        setRefundableSection(!refundableSection);
    }

    let length = 0;
    
    if(hotelList.data && hotelList.data.length > 0)
    {
        length = hotelList.data.length;
    }

    return (
        <div className="col-md-3 mb-3 sidebar hotel-sidebar">
            <ErrorBoundary>
                <SearchResult total={length} />
            </ErrorBoundary>
            <ErrorBoundary>
                <RatingsFilter handleRatingChange={handleRatingChange} showRatingsFilters={ratingSection} showRatingsFilterToggle={showRatingToggle} />
            </ErrorBoundary>
            <ErrorBoundary>
                <AreaFilter areaList={areaList} sectorId={sectorId} handleAreasChange={handleAreasChange} showAreasFilters={areaSection} showAreasFilterToggle={showAreaToggle} />
            </ErrorBoundary>
            <ErrorBoundary>
                <VendorTypeFilter vendorTypes={vendorTypes} handleVendorTypeChange={handleVendorTypeChange} showVendorTypeFilters={vendorTypeSection} showVendorTypeFilterToggle={showVendorTypeToggle} />
            </ErrorBoundary>
            <ErrorBoundary>
                <RefundFilter refundTypes={refundTypes} handleRefundChange={handleRefundChange} showRefundFilters={refundableSection} showRefundFilterToggle={showRefundToggle} />
            </ErrorBoundary>
        </div>
    );
}