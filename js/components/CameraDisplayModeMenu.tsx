import React, {Component} from 'react';
import {
  Text,
  ScrollView,
  LayoutRectangle,
  LayoutChangeEvent,
} from 'react-native';
import {
  FlingGestureHandler,
  Directions,
  State,
  FlingGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import withStyles, {InjectedStyles, makeStyleCreator} from '../lib/withStyles';
import {Theme} from '../style/themes';

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

const options = [
  'light',
  'dark',
  'average',
  'dominant',
  'saturated',
  'desaturated',
  'grid',
] as const;

export type DisplayMode = typeof options[number];

interface CameraDisplayModeMenuProps {
  initialValue: DisplayMode;
  onChange: (mode: DisplayMode) => void;
  styles: InjectedStyles<typeof getStyles>;
}

interface CameraDisplayModeMenuState {
  currentIndex: number;
  layoutsLoaded: boolean;
}

class CameraDisplayModeMenu extends Component<
  CameraDisplayModeMenuProps,
  CameraDisplayModeMenuState
> {
  scrollView: ScrollView | null = null;
  scrollViewLayout?: LayoutRectangle;
  itemLayouts: LayoutRectangle[] = [];

  constructor(props: CameraDisplayModeMenuProps) {
    super(props);
    const defaultIndex = Math.floor(options.length / 2);
    const startIndex = options.indexOf(props.initialValue);
    this.state = {
      layoutsLoaded: false,
      currentIndex: startIndex === -1 ? defaultIndex : startIndex,
    };
  }

  componentDidUpdate(
    prevProps: CameraDisplayModeMenuProps,
    prevState: CameraDisplayModeMenuState,
  ) {
    if (this.state.currentIndex !== prevState.currentIndex) {
      this.scrollToItem(this.state.currentIndex);
      this.props.onChange &&
        this.props.onChange(options[this.state.currentIndex]);
    }
  }

  maybeSetInitialPosition = () => {
    if (this.scrollViewLayout && this.itemLayouts[this.state.currentIndex]) {
      this.scrollToItem(this.state.currentIndex, false);
    }
  };

  getItemPosition = (i: number) => {
    const itemLayout = this.itemLayouts[i];
    const containerOffset = this.scrollViewLayout
      ? this.scrollViewLayout.width / 2
      : 0;
    return itemLayout.x + itemLayout.width / 2 - containerOffset;
  };

  scrollToItem(i: number, animated = true) {
    this.scrollView &&
      this.scrollView.scrollTo({
        x: this.getItemPosition(i),
        animated,
      });
  }

  hasAllLayouts = () => {
    return (
      this.scrollViewLayout &&
      this.itemLayouts.length === options.length &&
      this.itemLayouts.every(l => !!l)
    );
  };

  render() {
    return (
      <FlingGestureHandler
        direction={Directions.RIGHT}
        onHandlerStateChange={this.handleRightSwipe}
      >
        <FlingGestureHandler
          direction={Directions.LEFT}
          onHandlerStateChange={this.handleLeftSwipe}
        >
          {this.renderContent()}
        </FlingGestureHandler>
      </FlingGestureHandler>
    );
  }

  renderContent() {
    const {styles} = this.props;
    return (
      <ScrollView
        ref={r => (this.scrollView = r)}
        onLayout={this.handleLayoutContainer}
        horizontal={true}
        scrollEnabled={false}
        contentContainerStyle={styles.typeMenu}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {options.map((o, i) => {
          const isActive = this.state.currentIndex === i;

          return (
            <Text
              key={o}
              onLayout={e => this.handleLayoutItem(e, i)}
              style={[
                styles.typeOptionText,
                isActive && styles.activeOptionText,
              ]}
            >
              {capitalize(o)}
            </Text>
          );
        })}
      </ScrollView>
    );
  }

  handleRightSwipe = ({nativeEvent}: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state !== State.ACTIVE) return;
    let nextIndex = this.state.currentIndex - 1;
    if (nextIndex < 0) nextIndex = 0;
    this.setState({currentIndex: nextIndex});
  };

  handleLeftSwipe = ({nativeEvent}: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state !== State.ACTIVE) return;
    let nextIndex = this.state.currentIndex + 1;
    if (nextIndex > options.length - 1) nextIndex = options.length - 1;
    this.setState({currentIndex: nextIndex});
  };

  handleLayoutContainer = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    this.scrollViewLayout = layout;
    this.maybeSetInitialPosition();
  };

  handleLayoutItem = (
    {nativeEvent: {layout}}: LayoutChangeEvent,
    i: number,
  ) => {
    this.itemLayouts[i] = layout;
    this.maybeSetInitialPosition();

    if (!this.state.layoutsLoaded && this.hasAllLayouts()) {
      this.setState({layoutsLoaded: true});
    }
  };
}

const getStyles = makeStyleCreator((theme: Theme) => ({
  typeMenu: {
    flexDirection: 'row',
    paddingHorizontal: 200,
    alignItems: 'center',
  },
  typeOptionText: {
    color: theme.secondaryTextColor,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeOptionText: {
    color: theme.primaryTextColor,
  },
}));

export default withStyles(getStyles)(CameraDisplayModeMenu);
