/**
 *
 * Asynchronously loads the component for HotelsList
 *
 */

import loadable from '../../utils/loadable';

export default loadable(() => import('./index'));
