import React, { Component } from "react";
import { View, Alert, FlatList } from "react-native";
import Text from "./BaseText";
import Header from "./Header";
import Style from "../style";
import { connectWithStyles } from "../lib/withStyles";
import { loadBlockedUsers, unblockUser } from "../actions/AppActions";
import PressableView from "./PressableView";
import { navigateBack } from "../actions/NavigationActions";

class BlockedUsersScreen extends Component {
  componentDidMount() {
    this.props.dispatch(loadBlockedUsers());
  }

  render() {
    const { styles, blockedUsers } = this.props;

    return (
      <View style={styles.container}>
        <Header title="Blocked" onPressBack={this.handlePressBack} />
        <FlatList
          style={styles.blockedUserList}
          data={blockedUsers}
          renderItem={this.renderItem}
          keyExtractor={this.getItemKey}
          ListEmptyComponent={this.renderEmptyState}
        />
      </View>
    );
  }

  renderItem = ({ item }) => {
    const { styles } = this.props;

    return (
      <PressableView
        style={styles.user}
        onPress={() => this.handlePressUnblock(item)}
      >
        <Text>{item.name}</Text>
        <View style={styles.unblockButton}>
          <Text style={styles.unblockButtonText}>Unblock</Text>
        </View>
      </PressableView>
    );
  };

  renderEmptyState = () => {
    const { styles } = this.props;
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No blocked users</Text>
      </View>
    );
  };

  getItemKey = (item, index) => {
    try {
      return item.id.toString();
    } catch (e) {
      return index.toString();
    }
  };

  handlePressBack = () => {
    this.props.dispatch(navigateBack());
  };

  handlePressUnblock = user => {
    Alert.alert(
      "Unblock this user?",
      null,
      [
        { text: "Cancel", onPress: () => {} },
        { text: "Unblock", onPress: () => this.handleUnblockConfirmation(user) }
      ],
      { cancelable: false }
    );
  };

  handleUnblockConfirmation(user) {
    this.props.dispatch(unblockUser(user));
  }
}

const getStyles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 100
  },
  emptyStateText: {
    color: theme.secondaryTextColor
  },
  user: {
    height: Style.values.rowHeight,
    padding: Style.values.outerPadding,
    borderBottomWidth: Style.values.borderWidth,
    borderBottomColor: theme.secondaryBorderColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  unblockButton: {
    backgroundColor: theme.primaryButtonColor,
    padding: 3,
    paddingHorizontal: 6,
    flex: 0,
    borderRadius: 3
  },
  unblockButtonText: {
    fontSize: 12
  }
});

const selector = state => {
  return {
    blockedUsers: state.user.blockedUsers
  };
};

export default connectWithStyles(getStyles, selector)(BlockedUsersScreen);
