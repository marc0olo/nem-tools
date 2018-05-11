import { Action } from '@ngrx/store';

export const SETTINGS_KEY = 'SETTINGS';

export enum SettingsActionTypes {
  CHANGE_NEM_ADDRESS = '[Settings] Change NEM Address',
  PERSIST = '[Settings] Persist'
}

export class ActionSettingsChangeNemAddress implements Action {
  readonly type = SettingsActionTypes.CHANGE_NEM_ADDRESS;
  constructor(public payload: { nemAddress: string }) {}
}

export class ActionSettingsPersist implements Action {
  readonly type = SettingsActionTypes.PERSIST;
  constructor(public payload: { settings: SettingsState }) {}
}

export type SettingsActions =
  | ActionSettingsPersist
  | ActionSettingsChangeNemAddress;

export const initialState: SettingsState = {
  theme: 'BLACK-THEME',
  nemAddress: null
};

export const selectorSettings = state =>
  <SettingsState>(state.settings || { theme: '' });

export function settingsReducer(
  state: SettingsState = initialState,
  action: SettingsActions
): SettingsState {
  switch (action.type) {
    case SettingsActionTypes.CHANGE_NEM_ADDRESS:
      return { ...state, nemAddress: action.payload.nemAddress };

    default:
      return state;
  }
}

export interface SettingsState {
  theme: string;
  nemAddress: string;
}
