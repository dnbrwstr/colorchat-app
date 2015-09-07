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

export let selectColorPicker = (picker) => ({
  type: 'selectColorPicker',
  value: picker
});
