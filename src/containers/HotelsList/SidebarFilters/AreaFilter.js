import React from 'react';
import Header from '../../../helper/sidebarBtns/Header';
import Checkbox from '../../../helper/sidebarBtns/Checkbox';

function AreaFilter({ areaList, sectorId, handleAreasChange, showAreasFilters, showAreasFilterToggle })
{
    return (
        <div className="d-flex flex-column justify-content-start sidebar-filter-main">
            <Header title="Areas" showFilterToggle={showAreasFilterToggle} filter={showAreasFilters} />
            {
                (showAreasFilters) &&
                    <div className='max-height'>
                        {(typeof areaList !== 'undefined' && areaList.length > 0) && areaList.map((area, index) => (
                            (Number(area.sector_id) === Number(sectorId)) &&
                            <div className="px-3 pt-2 cabin-filter-checkbox-div" key={index}>
                                <Checkbox handle={handleAreasChange} title={area.area_name.toUpperCase()} value={area.area_id} name={area.area_name} checkes={handleAreasChange} />
                            </div>
                        ))}
                    </div>
            }
            
        </div>
    )
}

AreaFilter.propTypes = {

}

export default AreaFilter