import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {navigateTo} from '../store/navigation/actions';

class AuthCheckScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      if (this.props.isAuthenticated) {
        this.props.dispatch(navigateTo('app'));
      } else {
        this.props.dispatch(navigateTo('auth'));
      }
    }, 10);
  }

  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {},
});

const mapStateToProps = state => {
  return {
    isAuthenticated: state.user && state.user.token,
  };
};

export default connect(mapStateToProps)(AuthCheckScreen);
