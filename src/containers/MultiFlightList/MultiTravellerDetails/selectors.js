import { createSelector } from 'reselect';
import { initialState } from '../../NewBookingForm/Flights/Multi/reducer';

const selectMultiSearchObj = state => state.multiSearch || initialState;

const makeSelectMultiSearchObj = () => createSelector( selectMultiSearchObj, substate => substate );

export { makeSelectMultiSearchObj };