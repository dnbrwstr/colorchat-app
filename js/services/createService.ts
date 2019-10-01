import {merge} from 'ramda';
import {bindObjectMethods} from '../lib/Utils';

/**
 * Services are like simplified, nonrendering React components
 * They receive props and dispatch actions, and are useful for
 * dealing with changes not triggered by interface actions
 *
 * Example service object:
 * ````
 * let serviceObject = {
 *   onDidInitialize: function () {
 *     ...do stuff with initial props
 *   },
 *   onDidUpdate: function () {
 *     if (this.props !== prevProps) {
 *       this.props.dispatch(someActionCreator())
 *     }
 *   }
 * }
 * ````
 */
const createService = store => (serviceObject, selector) => {
  let service = {
    onDidInitialize: () => {},
    onDidUpdate: () => {},
    ...serviceObject,
  };

  service = bindObjectMethods(service);

  let getProps = () =>
    merge(selector(store.getState()), {
      dispatch: store.dispatch,
    });

  let props = getProps();
  service.props = props;

  store.subscribe(getState => {
    let oldProps = props;
    let newProps = getProps();
    service.props = newProps;
    props = newProps;

    /**
     * Defer calling hook until after
     * dispatch is finished
     */
    setTimeout(() => {
      service.onDidUpdate(oldProps);
    }, 0);
  });

  service.onDidInitialize();
  return service;
};

export default createService;
