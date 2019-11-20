import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {navigateTo} from '../store/navigation/actions';
import {AppState} from '../store/createStore';

const AuthCheckScreen = () => {
  const isAuthenticated = useSelector((state: AppState) => {
    return state.user && state.user.token;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      if (isAuthenticated) {
        dispatch(navigateTo('app'));
      } else {
        dispatch(navigateTo('auth'));
      }
    }, 10);
  }, []);

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {},
});

export default AuthCheckScreen;
