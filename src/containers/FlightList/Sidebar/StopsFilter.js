import React from 'react';
import Header from '../../../helper/sidebarBtns/Header';
import Checkbox from '../../../helper/sidebarBtns/Checkbox';

function StopsFilter({ direct, handleChange, oneStop, twoStop,showStopsFilters,showStopsFilterToggle})
{
  return (
    // StopsFilter Main Div
    <div className="d-flex flex-column justify-content-start sidebar-filter-main">
      <Header title="Number of Stops" showFilterToggle={showStopsFilterToggle} filter={showStopsFilters}/>
      <div style={{ display: (showStopsFilters) ? 'block' : 'none'}}>
        <div className="px-3 pt-2 cabin-filter-checkbox-div">
          <Checkbox title="Direct" handle={handleChange} value="direct" name="direct" stopfilter={true} />
        </div>
        <div className="px-3 pt-2 cabin-filter-checkbox-div">
          <Checkbox title="1 Stop" handle={handleChange} value="one-stops" name="one-stop" stopfilter={true} />
        </div>
        <div className="px-3 pt-2 cabin-filter-checkbox-div">
          <Checkbox title="Multiple Stops" handle={handleChange} value="multi-stops" name="multi-stops" stopfilter={true} />
        </div>
      </div>
      {/* <div className="p-3 cabin-filter-checkbox-div">
        <Checkbox title="2+ Stop" checked={twoStop} handle={handleChange} value="two-stops" name="two-stop" />
      </div> */}
    </div>
  )
}

export default StopsFilter
