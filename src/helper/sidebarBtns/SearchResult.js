import React from 'react';
import Header from './Header';

function SearchResult({ total }) {
    return (
        <div className="d-flex flex-column justify-content-start sidebar-filter-main">
            <Header title="Search Result" hide={true} />
            <div>
                <h5 className="px-3 pt-2 cabin-filter-checkbox-div">
                    {
                        (total === 1) ?
                            total + ' Result Found'
                            :
                            (total === 0) ?
                                'No Results Found'
                                :
                                total + ' Results Found'
                    }
                </h5>
            </div>
        </div>
    )
}

SearchResult.propTypes = {

}

export default SearchResult