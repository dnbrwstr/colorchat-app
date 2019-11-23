import React, {useEffect, FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {navigateTo} from '../store/navigation/actions';
import {AppState} from '../store/createStore';

const AuthCheckScreen: FC = () => {
  const isAuthenticated = useSelector((state: AppState) => {
    return state.user && state.user.token;
  });

  const dispatch = useDispatch();

  const isLoaded = useSelector((state: AppState) => {
    return state.load.complete;
  });

  useEffect(() => {
    if (!isLoaded) return;

    if (isAuthenticated) {
      dispatch(navigateTo('app'));
    } else {
      dispatch(navigateTo('auth'));
    }
  }, [isLoaded]);

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {},
});

export default AuthCheckScreen;
