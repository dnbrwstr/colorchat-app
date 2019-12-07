import React, {FC, useMemo, useEffect, useState} from 'react';
import {Message, MessageType, FinishedMessage} from '../store/messages/types';
import {useStaticData, useUpdateEffect} from '../lib/HookUtils';
import {isExpanded} from '../lib/MessageUtils';
import {Animated, Easing, View, StyleSheet} from 'react-native';
import BaseText from './BaseText';
import PressableView from './PressableView';
import Style from '../style';
import {humanDate, isLight, capitalize} from '../lib/Utils';

interface MessageContentProps {
  message: Message;
  resending: boolean;
  onPressEcho: () => void;
}

const MessageContent: FC<MessageContentProps> = props => {
  const opacity = useStaticData(new Animated.Value(0), []);
  const opacityStyle = useStaticData({opacity}, []);
  const [shouldRender, setShouldRender] = useState(false);

  const {message, resending} = props;
  const expanded = isExpanded(message);
  const errored = message.state == 'failed' && !resending;
  const shouldShowContent = expanded || errored;

  useUpdateEffect(() => {
    if (shouldShowContent) {
      setShouldRender(true);
    }
    const targetOpacity = shouldShowContent ? 1 : 0;
    const animation = Animated.timing(opacity, {
      toValue: targetOpacity,
      duration: 100,
      easing: Easing.linear,
    });
    animation.start(({finished}) => {
      if (finished && !shouldShowContent) {
        setShouldRender(false);
      }
    });
    return () => animation.stop();
  }, [shouldShowContent]);

  if (!shouldRender) {
    return null;
  }

  const finishedMessage = message as FinishedMessage;
  const borderColor = isLight(finishedMessage.color) ? 'black' : 'white';
  const isPicture = finishedMessage.type === MessageType.Picture;
  const isEcho = finishedMessage.type === MessageType.Echo;

  console.log('render contnent');

  return (
    <Animated.View style={[style.textContainer, opacityStyle]}>
      {errored ? (
        <View>
          <BaseText visibleOn={message.color}>Message failed to send</BaseText>
          <BaseText visibleOn={message.color}>Tap to retry</BaseText>
        </View>
      ) : (
        <>
          <BaseText style={[style.text]} visibleOn={finishedMessage.color}>
            {capitalize(finishedMessage.colorName)}
          </BaseText>

          <BaseText
            style={[style.text, style.timestamp]}
            visibleOn={finishedMessage.color}
          >
            {isPicture || isEcho ? (
              <>
                {isPicture && 'Camera'}
                {isEcho && 'Echo'}
                {'\n'}
              </>
            ) : null}
            {capitalize(humanDate(finishedMessage.createdAt))}
          </BaseText>

          <View style={[style.echoButton, {borderColor}]}>
            <PressableView
              style={style.echoButtonContent}
              onPress={props.onPressEcho}
            >
              <BaseText visibleOn={finishedMessage.color}>Echo</BaseText>
            </PressableView>
          </View>
        </>
      )}
    </Animated.View>
  );
};

const style = StyleSheet.create({
  textContainer: {
    flex: 1,
    padding: 16,
    flexShrink: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 290,
  },
  timestamp: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: '100%',
  },
  messageType: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    minWidth: 290,
  },
  echoButton: {
    position: 'absolute',
    top: 11,
    right: 11,
    borderWidth: 1,
    borderColor: 'white',
  },
  echoButtonContent: {
    padding: 12,
    paddingVertical: 5,
    flex: 1,
  },
  text: {
    width: '50%',
  },
});

export default MessageContent;
