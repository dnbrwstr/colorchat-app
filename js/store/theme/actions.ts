import {CHANGE_THEME, ChangeThemeAction} from './types';
import {Theme} from '../../style/themes';

export const changeTheme = (newTheme: Theme): ChangeThemeAction => {
  return {
    type: CHANGE_THEME,
    theme: newTheme,
  };
};
