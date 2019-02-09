import React from "react";
import { View } from "react-native";

// React native gateway warns when the non-function view is used,
// so i've created this dumb workaround;

const FunctionView = props => <View {...props} />;

export default FunctionView;
