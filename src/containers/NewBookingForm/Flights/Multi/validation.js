export function validateFlightFields(data)
{
    const fieldData = data.map((fld)=>{
        if (!fld.fromAirport || fld.fromAirport === '' || fld.fromAirport.indexOf('|') === -1)
        {
            fld.errors.fromAirport = '* Origin City is Required.';
        }
        else if (fld.fromAirport === fld.toAirport)
        {
            fld.errors.fromAirport = '* Origin & Destination City is Cannot be Same.';
        }
        else if (fld.errors.fromAirport)
        {
            delete fld.errors.fromAirport;
        }

        if (!fld.toAirport || fld.toAirport === '' || fld.toAirport.indexOf('|') === -1)
        {
            fld.errors.toAirport = '* Desitnation City is Required.';
        }
        else if (fld.fromAirport === fld.toAirport)
        {
            fld.errors.toAirport = '* Origin & Destination City is Cannot be Same.';
        }
        else if (fld.errors.toAirport)
        {
            delete fld.errors.toAirport;
        }
        
        if(!fld.departureDate || fld.departureDate === '')
        {
            fld.errors.departureDate = '* Departure Date is Required.';
        }
        else if (fld.errors.departureDate)
        {
            delete fld.errors.departureDate;
        }

        return fld;
    });

    return fieldData;
}

export function validateCabinPAXFields (cabin, adult, child, infant)
{

}