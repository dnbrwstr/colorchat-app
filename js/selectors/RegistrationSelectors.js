import { createSelector } from 'reselect';

let selectRegistrationData = state => state.registration;

export let selectRegistrationState = createSelector(
  selectRegistrationData,
  (registration) => registration
);
