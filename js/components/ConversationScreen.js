import React from 'react-native';
import ScrollBridge from '../lib/ScrollBridge';
import { connect } from 'react-redux/native';
import { merge } from 'ramda';
import { createSelector } from 'reselect';
import Style from '../style';
import Header from './Header';
import StickyView from './StickyView';
import PressableView from './PressableView';
import MessageList from './MessageList';
import ComposeBar from './ComposeBar';
import PlusButton from './PlusButton';
import { navigateTo } from '../actions/NavigationActions';
import * as MessageActions from '../actions/MessageActions';
import { conversationScreenSelector } from '../lib/Selectors';
import { updateConversationUi } from '../actions/AppActions';
import PlaceholderMessage from './PlaceholderMessage';
import TimerMixin from './mixins/TimerMixin';

let {
  View,
  Text,
  InteractionManager,
  Dimensions
} = React;

let { PureRenderMixin, Perf } = React.addons;

let {
  resendMessage,
  sendWorkingMessage,
  markMessageStale,
  startComposingMessage,
  cancelComposingMessage,
  destroyWorkingMessage,
  toggleMessageExpansion,
  loadMessages,
  unloadOldMessages
} = MessageActions;

let ConversationScreen = React.createClass({
  mixins: [TimerMixin, PureRenderMixin],

  getInitialState: function () {
    return {
      page: 0,
      loadedAll: false,
      scrollBridge: new ScrollBridge,
      lastOffset: 0,
      loadPending: false
    };
  },

  componentDidUpdate: function (prevProps) {
    let triggerPendingLoad =
      prevProps.transitioning &&
      !this.props.transitioning &&
      this.state.loadPending;

    if (triggerPendingLoad) {
      this.setState({ loadPending: false });
      this.loadNextPage();
    }
  },

  loadNextPage: function () {
    if (this.props.transitioning) {
      return this.setState({ loadPending: true })
    }

    this.setThrottleTimer('loadNext', () => {
      let nextPage = ++this.state.page;
      this.props.dispatch(
        loadMessages(this.props.contact.id, this.state.page)
      );
      this.setState({ page: nextPage });
    }, 1000);
  },

  shouldHideHeader: function () {
    let wH = Dimensions.get('window').height;
    let messages = this.props.messages;

    for (var h = 0, i = 0; h < wH + 100 && i < messages.length; ++i) {
      h += messages[i].height;
    }

    return  h >= wH + 100;
  },

  render: function () {
    let { contact, dispatch } = this.props;
    let name = [contact.firstName, contact.lastName]
      .filter(n => !!n).join(' ');

    return (
      <View style={style.container}>
        <MessageList
          scrollBridge={this.state.scrollBridge}
          onPresentMessage={this.onPresentMessage}
          onRetryMessageSend={this.onRetryMessageSend}
          onToggleMessageExpansion={this.onToggleMessageExpansion}
          scrollLocked={this.props.composing}
          messages={this.props.messages}
          user={this.props.user}
          onBeginningReached={this.handleScrollToBottom}
          onEndReached={this.loadNextPage}
        />
        <PlusButton
          onPress={this.onStartComposing}
          visible={!this.props.composing && !this.props.sending && !this.props.cancelling}
        />
        <ComposeBar
          ref="composeBar"
          active={this.props.composing}
          onSend={this.onSendMessage}
          onCancel={this.onStopComposing}
        />
        <StickyView
          scrollBridge={this.state.scrollBridge}
          autoHide={this.shouldHideHeader()}
        >
          <Header
            title={name}
            showBack={true}
            color="white"
            backgroundColor={'rgba(0,0,0,.8)'}
            highlightColor={'rgba(30,30,30,.8)'}
            onBack={() => dispatch(navigateTo('inbox'))}
          />
        </StickyView>
      </View>
    );
  },

  handleScrollToBottom: function () {
    this.props.dispatch(unloadOldMessages());
  },

  onSendMessage: function (message) {
    if (this.props.sending) return;

    this.props.dispatch(updateConversationUi({
      sending: true,
      composing: false
    }));

    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(sendWorkingMessage(this.getWorkingMessage()));

        setTimeout(() => {
          InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(updateConversationUi({
              sending: false
            }));
          });
        }, 0);
      });
    }, 0);
  },

  onStartComposing: function () {
    this.props.dispatch(startComposingMessage({
      recipientId: this.props.contact.id,
    }));
  },

  onStopComposing: function () {
    this.props.dispatch(cancelComposingMessage(this.getWorkingMessage()));

    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        this.props.dispatch(destroyWorkingMessage(this.getWorkingMessage()));

        setTimeout(() => {
          InteractionManager.runAfterInteractions(() => {
            this.props.dispatch(updateConversationUi({
              cancelling: false
            }));
          })
        }, 0)
      });
    }, 0);
  },

  getWorkingMessage: function () {
    return this.props.messages.filter(
      m => m.state === 'composing' || m.state === 'cancelling'
    )[0];
  },

  onSelectPicker: function (value) {
    this.props.dispatch(selectColorPicker(value));
  },

  onToggleMessageExpansion: function (message) {
    this.props.dispatch(toggleMessageExpansion(message));
  },

  onRetryMessageSend: function (message) {
    this.props.dispatch(resendMessage(message));
  },

  onPresentMessage: function (message) {
    this.props.dispatch(markMessageStale(message));
  },

});

let style = Style.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  }
});

export default connect(conversationScreenSelector)(ConversationScreen);
