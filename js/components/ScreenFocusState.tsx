import React, {
  Component,
  FC,
  useState,
  useEffect,
  useContext,
  ReactChild,
} from 'react';
import {EventType} from 'react-navigation';
import {useNavigation} from 'react-navigation-hooks';
import {Optionalize} from '../lib/TypeUtils';

export const ScreenFocusStateContext = React.createContext('blurred');
const ScreenFocusStateContextProvider = ScreenFocusStateContext.Provider;

export type FocusState = 'focusing' | 'focused' | 'blurring' | 'blurred';

interface ScreenFocusStateProviderProps {
  children: ReactChild;
}

export const ScreenFocusStateProvider: FC<ScreenFocusStateProviderProps> = props => {
  const navigation = useNavigation();
  const [focusState, setFocusState] = useState('blurred');

  const addTrigger = (eventName: EventType, value: string) => {
    return navigation.addListener(eventName, () => {
      setFocusState(value);
    });
  };

  useEffect(() => {
    const subscriptions = [
      addTrigger('willFocus', 'focusing'),
      addTrigger('didFocus', 'focused'),
      addTrigger('willBlur', 'blurring'),
      addTrigger('didBlur', 'blurred'),
    ];
    return () => {
      subscriptions.map(s => s.remove());
    };
  }, []);

  return (
    <ScreenFocusStateContextProvider value={focusState}>
      {props.children}
    </ScreenFocusStateContextProvider>
  );
};

export const useScreenFocusState = () => {
  return useContext(ScreenFocusStateContext);
};

export interface ScreenFocusStateProps {
  screenFocusState?: FocusState;
}

export const withScreenFocusStateProvider = <
  T extends ScreenFocusStateProps = ScreenFocusStateProps
>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const HOC: FC<Optionalize<T, ScreenFocusStateProps>> = props => {
    return (
      <ScreenFocusStateProvider>
        <WrappedComponent {...(props as T)} />
      </ScreenFocusStateProvider>
    );
  };
  return HOC;
};

export const withScreenFocusState = <
  T extends ScreenFocusStateProps = ScreenFocusStateProps
>(
  WrappedComponent: React.ComponentType<T>,
) => (props: Optionalize<T, ScreenFocusStateProps>) => {
  return (
    <ScreenFocusStateContext.Consumer>
      {screenFocusState => (
        <WrappedComponent
          {...(props as T)}
          screenFocusState={screenFocusState}
        />
      )}
    </ScreenFocusStateContext.Consumer>
  );
};

export const withOwnFocusState = <
  T extends ScreenFocusStateProps = ScreenFocusStateProps
>(
  WrappedComponent: React.ComponentType<T>,
) => withScreenFocusStateProvider(withScreenFocusState(WrappedComponent));
