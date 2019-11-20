import React, {FC} from 'react';
import {View, ViewProps} from 'react-native';

// React native gateway warns when the non-function view is used,
// so i've created this dumb workaround;

const FunctionView: FC<ViewProps> = (props: ViewProps) => <View {...props} />;

export default FunctionView;
