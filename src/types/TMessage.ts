export enum TAction {
  INIT = "INIT",
}

export type TMessage = {
  action: `${TAction}`;
  tabId?: number;
};
