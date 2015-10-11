import config from '../config';

export let setMainTab = (tabTitle) => {
  return {
    type: 'setMainTab',
    tabTitle: tabTitle
  };
};

export let startComposingMessage = () => ({
  type: 'toggleComposingMessage',
  value: true
});

export let stopComposingMessage = () => ({
  type: 'toggleComposingMessage',
  value: false
});

export let selectColorPicker = picker => ({
  type: 'selectColorPicker',
  value: picker
});

export let updateConversationUi = newData => ({
  type: 'updateConversationUi',
  data: newData
});

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
}

export let triggerMemoryWarning = () => {
  return {
    type: 'memoryWarning'
  };
};
