import createRoutingReducer from "../lib/createRoutingReducer";
import Style from "../style";

let initialState = Style.themes.dark;

let handlers = {
  changeTheme: function(state, action) {
    return action.theme;
  }
};

export default createRoutingReducer({
  key: "theme",
  handlers,
  initialState
});