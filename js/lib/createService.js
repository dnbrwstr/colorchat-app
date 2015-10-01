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
  let timeout;

  store.subscribe(getState => {
    let oldProps = props;
    let newProps = getProps();
    service.props = newProps;
    props = newProps;

    setTimeout(() => {
      service.onDidUpdate(oldProps);
    }, 0);
  });

  let service = merge({
    onDidInitialize: () => {},
    onDidUpdate: () => {}
  }, serviceObject);

  for (var key in service) {
    if (typeof service[key] === 'function');
    service[key] = service[key].bind(service);
  }

  service.props = props;

  service.onDidInitialize();

  return service;
}