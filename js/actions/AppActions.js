import config from '../config';

export let setMainTab = tabTitle => {
  return {
    type: 'setMainTab',
    tabTitle: tabTitle
  };
};

export let startComposingMessage = () => {
  return {
    type: 'toggleComposingMessage',
    value: true
  };
};

export let stopComposingMessage = () => {
  return {
    type: 'toggleComposingMessage',
    value: false
  };
};

export let selectColorPicker = picker => {
  return {
    type: 'selectColorPicker',
    value: picker
  };
};

export let updateConversationUi = newData => {
  return {
    type: 'updateConversationUi',
    data: newData
  };
};

export let presentInternalAlert = data => {
  return {
    type: 'presentInternalAlert',
    data: data
  };
};

export let dismissInternalAlert = id => {
  return {
    type: 'dismissInternalAlert',
    alertId: id
  };
};

export let changeAppState = newState => {
  return {
    type: 'changeAppState',
    newState
  };
};

export let triggerMemoryWarning = () => {
  return {
    type: 'memoryWarning'
  };
};
