import React, {FC, useCallback, PropsWithChildren} from 'react';
import {Linking, TextProps} from 'react-native';
import BaseText from './BaseText';

interface TextLinkProps extends PropsWithChildren<TextProps> {
  href: string;
}

const TextLink: FC<TextLinkProps> = props => {
  const {href, ...textProps} = props;

  const handlePress = useCallback(() => {
    Linking.openURL(props.href);
  }, [href]);

  return <BaseText {...textProps} onPress={handlePress} />;
};

const MemoizedTextLink = React.memo(TextLink);

export default MemoizedTextLink;
