import React from 'react';
import Header from '../../../helper/sidebarBtns/Header';
import Checkbox from '../../../helper/sidebarBtns/Checkbox';

function VendorTypeFilter({ vendorTypes, handleVendorTypeChange, showVendorTypeFilters, showVendorTypeFilterToggle })
{
    return (
        <div className="d-flex flex-column justify-content-start sidebar-filter-main">
            <Header title="Property Types" showFilterToggle={showVendorTypeFilterToggle} filter={showVendorTypeFilters} />
            {
                (showVendorTypeFilters) &&
                    <div className='max-height'>
                        {(typeof vendorTypes !== 'undefined') && vendorTypes.map((vType, index) => (
                            <div className="px-3 pt-2 cabin-filter-checkbox-div" key={index}>
                                <Checkbox handle={handleVendorTypeChange} title={vType.title} value={vType.name} name={vType.name} checkes={handleVendorTypeChange} />
                            </div>
                        ))}
                    </div>
            }
            
        </div>
    )
}

VendorTypeFilter.propTypes = {

}

export default VendorTypeFilter