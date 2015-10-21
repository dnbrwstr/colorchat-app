import React from 'react-native';
import Header from './Header';
import Style from '../style';
import measure from '../measure';

let {
  Animated,
  Dimensions
} = React;

const HIDE_ANIMATION_DURATION = 200;

let StickyView = React.createClass({
  propTypes: {
    autoHide: React.PropTypes.boolean,
    autoHideDelay: React.PropTypes.number,
    scrollViewContentSize: React.PropTypes.shape({
      width: React.PropTypes.number,
      height: React.PropTypes.number
    }),
    scrollViewOffset: React.PropTypes.shape({
      x: React.PropTypes.number,
      y: React.PropTypes.number
    })
  },

  getDefaultProps: function () {
    return {
      autoHide: false,
      autoHideDelay: 2000
    };
  },

  getInitialState: function () {
    return {
      contentHeight: null,
      hideTimeout: null,
      offset: 0,
      animatedOffset: new Animated.Value(0)
    };
  },

  componentDidMount: function () {
    if (this.props.autoHide) this.hideAfterDelay();
  },

  componentWillReceiveProps: function (nextProps) {
    let currentOffset = this.props.scrollViewOffset;
    let nextOffset = nextProps.scrollViewOffset;
    if (currentOffset && nextOffset &&
        currentOffset !== nextOffset &&
        nextOffset.y > 0) {
      this.handleScroll(nextProps.scrollViewOffset);
    }
  },

  componentWillUnmount: function () {
    clearTimeout(this.state.hideTimeout);
  },

  hideAfterDelay: function () {
    if (this.state.hideTimeout) clearTimeout(this.state.hideTimeout);

    this.setState({
      hideTimeout: setTimeout(this.hide, this.props.autoHideDelay)
    });
  },

  hide: function () {
    this.setState({ offset: -this.state.contentHeight })

    Animated.timing(this.state.animatedOffset, {
      toValue: -this.state.contentHeight,
      duration: HIDE_ANIMATION_DURATION
    }).start();
  },

  handleScroll: function (scrollViewOffset) {
    let wH = Dimensions.get('window').height;
    let deltaY = this.props.scrollViewOffset.y - scrollViewOffset.y;

    if (this.props.scrollViewContentSize.height < scrollViewOffset.y + wH && deltaY > 0) deltaY = 0;
    let newOffset = this.state.offset - deltaY;

    if (newOffset > 0) newOffset = 0;
    if (newOffset < -this.state.contentHeight) newOffset = -this.state.contentHeight;

    this.setState({ offset: newOffset });
    this.state.animatedOffset.setValue(newOffset);
    this.hideAfterDelay();
  },

  handleLayout: async function () {
    let contentSize = await measure(this.refs.view);
    this.setState({ contentHeight: contentSize.height });
  },

  render: function () {
    let containerStyles = [
      style.container,
      { transform: [{ translateY: this.state.animatedOffset }] }
    ];

    return (
      <Animated.View ref="view" style={containerStyles} onLayout={this.handleLayout}>
        { this.props.children }
      </Animated.View>
    );
  }
});

let style = Style.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent'
  }
});

export default StickyView;
