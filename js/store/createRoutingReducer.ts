import {Action, Reducer, AnyAction} from 'redux';

export type Actions<T extends keyof any = string> = Record<T, Action>;

export type CaseReducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A,
) => S;

export type CaseReducers<S, AS extends Actions> = {
  [T in keyof AS]: AS[T] extends Action ? CaseReducer<S, AS[T]> : void;
};

export interface RoutingReducerOptions<S, CR> {
  handlers: CR;
  initialState: S;
}

export type CaseHandlerMap<S> = {[key: string]: CaseReducer<S, any>};

export function createReducer<
  S,
  CR extends CaseReducers<S, any> = CaseReducers<S, any>
>(initialState: S, actionsMap: CR): Reducer<S> {
  return (state = initialState, action): S => {
    if (state === undefined) return initialState;
    const caseReducer = actionsMap[action.type];
    return caseReducer ? caseReducer(state, action) : state;
  };
}

const createRoutingReducer = <
  S,
  CR extends CaseReducers<S, any> = CaseReducers<S, any>
>(
  options: RoutingReducerOptions<S, CR>,
): Reducer<S> => {
  const {handlers, initialState} = options;

  const baseHandlers: CaseReducers<S, any> = {
    deleteAccount: (state, action) => {
      if (action.state === 'complete') {
        return initialState;
      } else {
        return state;
      }
    },
  };

  const finalHandlers: CR = {
    ...baseHandlers,
    ...handlers,
  };

  return (state, action) => {
    if (state === undefined) return initialState;
    const handler = finalHandlers[action.type];
    return handler ? handler(state, action) : state;
  };
};

export default createRoutingReducer;
