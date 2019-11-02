import {AnyAction, Action, Dispatch} from 'redux';

export enum AsyncActionState {
  Started = 'started',
  Complete = 'complete',
  Failed = 'failed',
}

export type AsyncActionStartedResult = {
  state: AsyncActionState.Started;
};

export type AsyncActionFailedResult = {
  state: AsyncActionState.Failed;
  error: string;
};

export type AsyncActionSuccessResult<T extends any = any> = {
  state: AsyncActionState.Complete;
  result: T;
};

export type AsyncActionResult<B, R> =
  | B & AsyncActionStartedResult
  | B & AsyncActionFailedResult
  | B & AsyncActionSuccessResult<R>;

export type AsyncAction<B, R = any> = AsyncActionResult<B, R>;

export type SimpleAsyncAction = AsyncAction<Action<string>>;

export type AsyncResultType<
  A extends SimpleAsyncAction
> = A extends AsyncActionSuccessResult ? A['result'] : never;

export type AddedAsyncProps<A extends SimpleAsyncAction> = Omit<
  A,
  keyof Omit<SimpleAsyncAction, keyof Action>
>;

export const dispatchAsyncActions = async <
  // Default to never to cause an error if type isn't supplied
  A extends SimpleAsyncAction = never
>(
  baseAction: AddedAsyncProps<A>,
  operation: Promise<AsyncResultType<A>>,
  dispatch: Dispatch,
) => {
  dispatch(asyncActionStarted(baseAction));
  try {
    const result = await operation;
    dispatch(asyncActionComplete(baseAction, result));
  } catch (e) {
    dispatch(asyncActionFailed(baseAction, e.mesage));
  }
};

export const asyncActionStarted = <B extends Action>(
  baseAction: B,
): AsyncAction<B> => {
  return {
    ...baseAction,
    state: AsyncActionState.Started,
  };
};

export const asyncActionComplete = <B extends Action, R = any>(
  baseAction: B,
  result: R,
): AsyncAction<B, R> => {
  return {
    ...baseAction,
    state: AsyncActionState.Complete,
    result,
  };
};

export const asyncActionFailed = <B extends Action, R = any>(
  baseAction: B,
  error: string,
): AsyncAction<B, R> => {
  return {
    ...baseAction,
    state: AsyncActionState.Failed,
    error,
  };
};
