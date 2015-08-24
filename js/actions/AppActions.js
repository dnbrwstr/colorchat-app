export let changeMainTab = (newTab) => ({
  type: 'changeMainTab',
  tabId: newTab.id
});

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
