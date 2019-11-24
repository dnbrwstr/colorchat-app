import {Theme} from '../../style/themes';

export const CHANGE_THEME = 'changeTheme';

export interface ThemeState extends Theme {}

export interface ChangeThemeAction {
  type: typeof CHANGE_THEME;
  theme: Theme;
}

export type ThemeAction = ChangeThemeAction;
