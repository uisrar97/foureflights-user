import React from 'react';
import Header from '../../../helper/sidebarBtns/Header';
import Checkbox from '../../../helper/sidebarBtns/Checkbox';

function AirlinesFilter({ airlines, handleAirlineChange,showAirlinesFilters,showAirlinesFilterToggle})
{
  return (
    <div className="d-flex flex-column justify-content-start sidebar-filter-main">
      <Header title="Available Airlines" showFilterToggle={showAirlinesFilterToggle}  filter={showAirlinesFilters}/>
      <div style={{display: (showAirlinesFilters) ? 'block' : 'none'}}>
        {(typeof airlines !== 'undefined') && airlines.map((airline, index)=>(
          <div className="px-3 pt-2 cabin-filter-checkbox-div" key={index}>
            <Checkbox handle={handleAirlineChange} title={airline.air_name.charAt(0).toUpperCase() + airline.air_name.slice(1)} value={airline.code} name={airline.code} checkes={handleAirlineChange} airline={true} />
          </div>
        ))}
      </div>
    </div>
  )
}

AirlinesFilter.propTypes = {

}

export default AirlinesFilter

