import { TMessage } from "@/types/TMessage";

export const getActiveTab = async (): Promise<chrome.tabs.Tab | undefined> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.query({ active: true }, (tabs) => {
        if (chrome.runtime.lastError) throw new Error(chrome.runtime.lastError.toString());
        const tab = tabs.at(0);
        if (!tab) throw new Error("An error occurred when getting the active tab");
        resolve(tab);
      });
    } catch (error) {
      reject(undefined);
    }
  });
};

export const sendMessage = async (request: TMessage): Promise<TMessage> => {
  try {
    const response = await chrome.runtime.sendMessage<TMessage, TMessage>(request);
    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error as Error);
  }
};

export const sendMessageToContent = async (request: TMessage, tabId?: number): Promise<TMessage> => {
  try {
    tabId = tabId ?? Number((await getActiveTab())?.id);
    if (!tabId || tabId <= 0) {
      throw Error("Can't get the active tab");
    }
    const contentResponse = await chrome.tabs.sendMessage<TMessage, TMessage>(tabId, { ...request, tabId });
    return Promise.resolve(contentResponse);
  } catch (error) {
    return Promise.reject(error as Error);
  }
};

export const isTMessage = (response: TMessage): response is TMessage => {
  return response && typeof response.action === "string";
};
