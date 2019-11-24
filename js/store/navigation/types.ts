import {Contact} from '../contacts/types';

export const NAVIGATE_TO = 'navigateTo';
export const NAVIGATE_BACK = 'navigateBack';
export const NAVIGATE_TO_CONVERSATION = 'navigateToConversation';
export const START_NAVIGATION_TRANSITION = 'startNavigationTransition';
export const END_NAVIGATION_TRANSITION = 'endNavigationTransition';

export interface NavigateAction {
  type: typeof NAVIGATE_TO;
  routeName: string;
  params?: any;
}

export interface NavigateBackAction {
  type: typeof NAVIGATE_BACK;
}

export interface NavigateToConversationAction {
  type: typeof NAVIGATE_TO_CONVERSATION;
  contactId: number;
  contact?: Contact;
}
