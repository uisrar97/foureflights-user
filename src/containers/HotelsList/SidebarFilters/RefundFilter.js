import React from 'react';
import Header from '../../../helper/sidebarBtns/Header';
import Checkbox from '../../../helper/sidebarBtns/Checkbox';

function RefundFilter({ refundTypes, handleRefundChange, showRefundFilters, showRefundFilterToggle })
{
    return (
        <div className="d-flex flex-column justify-content-start sidebar-filter-main">
            <Header title="Refundable" showFilterToggle={showRefundFilterToggle} filter={showRefundFilters} />
            {
                (showRefundFilters) &&
                    <div className='max-height'>
                        {(typeof refundTypes !== 'undefined' && refundTypes.length > 0) && refundTypes.map((refund, index) => (
                            <div className="px-3 pt-2 cabin-filter-checkbox-div" key={index}>
                                <Checkbox handle={handleRefundChange} title={refund.title.toUpperCase()} value={refund.title} name={refund.title} checkes={handleRefundChange} />
                            </div>
                        ))}
                    </div>
            }
            
        </div>
    )
}

RefundFilter.propTypes = {

}

export default RefundFilter