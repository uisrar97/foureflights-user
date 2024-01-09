import React from 'react';
import { Rating } from 'react-simple-star-rating';
import Header from '../../../helper/sidebarBtns/Header';

function RatingsFilter({ handleRatingChange, showRatingsFilters, showRatingsFilterToggle })
{
    return (
        <div className="d-flex flex-column justify-content-start sidebar-filter-main">
            <Header title="Ratings" showFilterToggle={showRatingsFilterToggle} filter={showRatingsFilters} />
            {
                (showRatingsFilters) &&
                    <div className='max-height'>
                        <div className="px-3 pt-2 cabin-filter-checkbox-div">
                            {
                                [...Array(5)].map((rating, index)=>{
                                    return(
                                        <div className="form-group form-check m-0" key={index}>
                                            <input type="checkbox" className="form-check-input" onChange={handleRatingChange} id={index} name={`${index+1}`} value={index+1} />
                                            <i htmlFor={index} />
                                            <label className="form-check-label" htmlFor={index}>
                                                <Rating
                                                    ratingValue={index + 1}
                                                    iconsCount={index + 1}
                                                    readonly={true}
                                                    emptyIcon={<i className="fa fa-star" />}
                                                    size={15}
                                                    emptyColor="#ffd700"
                                                />
                                            </label>
                                        </div>
                                    );
                                })
                            }
                            
                        </div>
                    </div>
            }
            
        </div>
    )
}

export default RatingsFilter