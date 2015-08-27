// Services are like simplified, nonrendering React components
// They receive props and dispatch actions, and are useful for
// dealing with changes not triggered by interface actions
//
// Example service object:
//
// let serviceObject = {
//   onDidInitialize: function () {
//     ...do stuff with initial props
//   },
//   onDidUpdate: function () {
//     if (this.props !== prevProps) {
//       this.props.dispatch(someActionCreator())
//     }
//   }
// }

import { merge } from 'ramda';

export default createService = (store) => (serviceObject, selector) => {
  let getProps = () => merge(selector(store.getState()), {
    dispatch: store.dispatch
  });

  let props = getProps();

  store.subscribe(getState => {
    let newProps = getProps();
    service.props = newProps;
    service.onDidUpdate(props);
    props = newProps;
  });

  let service = merge({
    onDidInitialize: () => {},
    onDidUpdate: () => {}
  }, serviceObject);

  service.props = props;

  service.onDidInitialize();

  return service;
}