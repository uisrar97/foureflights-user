/**
 *
 * Asynchronously loads the component for HotelBooking
 *
 */

import loadable from '../../../utils/loadable';

export default loadable(() => import('./index'));
